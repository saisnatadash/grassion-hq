import React, { useState } from "react";
import Login from "./Login";
import GrassionHQ from "./GrassionHQ";
import { isAuthenticated } from "./auth";

export default function App() {
  const [auth, setAuth] = useState(isAuthenticated);
  if (!auth) return <Login onAuth={() => setAuth(true)} />;
  return <GrassionHQ />;
}
