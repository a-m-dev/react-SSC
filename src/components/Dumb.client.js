import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";

export default function Dumb() {
  // const [count, setCount] = useState(0);
  const { appState, setAppState } = useAppContext();

  // console.log({ appState });

  return (
    <div>
      This is dumb
      <hr />
      <button
        onClick={() => {
          setAppState((prev) => ({
            ...prev,
            shouldChange: !prev.shouldChange,
          }));
        }}
      >
        showing: {String(appState.shouldChange)}
      </button>
    </div>
  );
}
