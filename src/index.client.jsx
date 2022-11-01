import React from "react";
import { createRoot } from "react-dom";
import Root from "./Root.client";

const initialCache = new Map();
createRoot(document.getElementById("root")).render(
  <Root initialCache={initialCache} />
);
