import React, { useState, useTransition } from "react";
import { useAppContext } from "../contexts/AppContext.client";

export default function Dumb() {
  const { appState, setAppState } = useAppContext();
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      This is dumb!
      <hr />
      <button
        onClick={() => {
          startTransition(() => {
            setAppState((prev) => ({
              ...prev,
              shouldChange: !prev.shouldChange,
            }));
          });
        }}
      >
        showing: {String(appState.shouldChange)}
      </button>
    </div>
  );
}
