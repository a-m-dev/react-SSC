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

const ReactApp = require("../src/components/Root.server.js").default;

const managersData = require("../data/managers.json");

let cred = require("../credentials");

cred = {
  ...cred,
  host: "host.docker.internal" || "192.168.1.66",
};

const pool = new Pool(cred);

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

app.get("/react", function (req, res) {
  sendResponse(req, res, null);
});

app.get(
  "/employee/:id",
  handleErrors(async function (req, res) {
    try {
      const { rows } = await pool.query(
        "select * from employees where id = $1",
        [req.params.id]
      );
      res.json(rows[0]);
    } catch (error) {
      console.log("server: ", { error });
      res.status(400).json({
        error: true,
      });
    }
  })
);

app.get(
  "/getEmployeesCount",
  handleErrors(async function (req, res) {
    const { rows } = await pool.query("select count(*) from employees");
    res.json(rows[0]);
  })
);

app.post(
  "/employee",
  handleErrors(async function (req, res) {
    const now = new Date();
    const result = await pool.query(
      `insert into employees (name, email, phone_number, office, manager, org_unit, main_text, github, twitter, stackoverflow, linkedin, image_portrait_url, image_wall_of_leet_url, highlighted, published) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning id`,
      [
        req.body.name,
        `${req.body.name}@1337.tech`,
        `+46133333337`,
        req.body.office,
        req.body.manager,
        `/Employees`,
        req.body.text,
        "",
        "",
        "",
        "",
        "",
        "",
        false,
        true,
      ]
    );
    const insertedId = result.rows[0].id;
    sendResponse(req, res, insertedId);
  })
);

app.get(
  "/managerByEmail/:email",
  handleErrors(async function (req, res) {
    try {
      const { rows } = await pool.query(
        "select * from employees where email = $1",
        [req.params.email]
      );
      res.json(rows[0]);
    } catch (error) {
      console.log("server: ", { error });
      res.status(400).json({
        error: true,
      });
    }
  })
);

app.get(
  "/managers",
  handleErrors(async function (req, res) {
    res.status(200).json(managersData);
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
    "utf8"
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
    selectedEmployee: location.selectedEmployee,
    shouldShowCreateEmployeeDialog: location.shouldShowCreateEmployeeDialog,
  });
}
