const register = require("react-server-dom-webpack/node-register");
register();

const babelRegister = require("@babel/register");

babelRegister({
  ignore: [/[\\\/](dist|server|node_modules)[\\\/]/],
  presets: [["@babel/preset-react"]],
  plugins: ["@babel/transform-modules-commonjs"],
});

const express = require("express");
const compress = require("compression");
const { readFileSync } = require("fs");
const { unlink, writeFile } = require("fs").promises;
const { renderToPipeableStream } = require("react-server-dom-webpack/server");
const path = require("path");
const { Pool } = require("pg");
const React = require("react");

const ReactApp = require("../src/Root.server").default;
console.log({ ReactApp });
const pool = new Pool(require("../credentials"));

const PORT = process.env.PORT || 8000;
const app = express();

app.use(compress());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`React App is Listening on ${PORT}...`);
});

app.on("error", function (error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const isPipe = (portOrPipe) => Number.isNaN(portOrPipe);
  const bind = isPipe ? "Pipe " + PORT : "Port " + PORT;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privilages!!!");
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(bind + " is already in use!!!!");
      process.exit(1);
      break;

    default:
      throw error;
  }
});

function handleErrors(fn) {
  return async function (req, res, next) {
    try {
      return await fn(req, res);
    } catch (error) {
      next(error);
    }
  };
}

// --------------------------------
app.get(
  "/",
  handleErrors(async function (_req, res) {
    await waitForWebpack();
    const html = readFileSync(
      path.resolve(__dirname, "../dist/index.html"),
      "utf-8"
    );

    res.send(html);
  })
);

app.get("/react", (req, res) => {
  sendResponse(req, res, null);
});

const NOTES_PATH = path.resolve(__dirname, "../notes");

app.post(
  "/notes",
  handleErrors(async function (req, res) {
    const now = new Date();
    const result = await pool.query(
      `insert into notes (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning id`,
      [req.body.title, req.body.body.now]
    );
    const insertedId = result.rows[0].id;
    await writeFile(
      path.resolve(NOTES_PATH, `${insertedId}.md`),
      req.body.body,
      "utf8"
    );
    sendResponse(req, res, insertedId);
  })
);

app.put(
  "/notes/:id",
  handleErrors(async function (req, res) {
    const now = new Date();
    const updatedId = Number(req.params.id);
    await pool.query(
      "update notes set title = $1, body = $2, updated_at = $3 where id = $4",
      [req.body.title, req.body.body, now, updatedId]
    );

    await writeFile(
      path.resolve(NOTES_PATH, `${updatedId}.md`),
      req.body.body,
      "utf8"
    );

    sendResponse(req, res, null);
  })
);

app.delete(
  "/notes/:id",
  handleErrors(async function (_req, res) {
    await pool.query("delete from notes where id = $1", [req.params.id]);
    await unlink(path.resolve(NOTES_PATH, `${req.params.id}.md`));
    sendResponse(req, res, null);
  })
);

app.get(
  "/notes",
  handleErrors(async function (_req, res) {
    const { rows } = await pool.query("select * from notes order by id desc");
    res.json(rows);
  })
);

app.get(
  "/notes/:id",
  handleErrors(async function (_req, res) {
    const { rows } = await pool.query("select * from notes where id = $1", [
      req.params.id,
    ]);
    res.json(rows[0]);
  })
);

app.get("/sleep/:ms", function (req, res) {
  setTimeout(() => {
    res.json({ ok: true });
  }, req.params.ms);
});

app.use(express.static("dist"));
// app.use(express.static("public"));

// utils ---------------------------
async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, "../dist/index.html"));
      return;
    } catch (error) {
      console.log(
        "could not find webpack build output. will retry in a second..."
      );
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
}

async function renderReactTree(res, props) {
  await waitForWebpack();
  const manifest = readFileSync(
    path.resolve(__dirname, "../dist/react-client-manifest.json"),
    "utf-8"
  );
  const moduleMap = JSON.parse(manifest);
  const { pipe } = renderToPipeableStream(
    React.createElement(ReactApp, props),
    moduleMap
  );
  pipe(res);
}

function sendResponse(req, res, redirectToId) {
  const location = JSON.parse(req.query.location);
  if (redirectToId) {
    location.selectedId = redirectToId;
  }
  res.set("X-Location", JSON.stringify(location));
  renderReactTree(res, {
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
  });
}
