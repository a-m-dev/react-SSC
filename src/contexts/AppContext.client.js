import React, { createContext, useContext, useEffect, useState } from "react";
import { _useServerResponse } from "../utils/Cache.client";

export const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider() {
  const [appState, setAppState] = useState({
    // shouldChange: false,
    selectedEmployee: null,
    shouldShowCreateEmployeeDialog: false,
  });
  const { tree } = _useServerResponse(appState);
  // const { tree: _tree } = _useServerResponse({ appState });

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {tree}
    </AppContext.Provider>
  );
}
