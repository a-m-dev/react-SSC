import React, { Suspense } from "react";
import Dumb from "./Dumb.client";
import { OtherDumb } from "./OtherDumb.server";

export default function App({ shouldChange }) {
  return (
    <Suspense fallback={"loading..."}>
      <div>
        Hi There from react app SERVER!
        <Dumb />
        {/* <OtherDumb /> */}
        <br />
        <br />
        <br />
        {shouldChange && "hi"}
        {shouldChange && <OtherDumb />}
      </div>
    </Suspense>
  );
}
