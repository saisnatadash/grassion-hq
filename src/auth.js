const AUTH_KEY = "ghq_auth";

/** Stay signed in on this browser/device (localStorage survives tab/browser restarts). */
export function isAuthenticated() {
  try {
    if (localStorage.getItem(AUTH_KEY) === "1") return true;
    // Migrate older sessions that used sessionStorage
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      localStorage.setItem(AUTH_KEY, "1");
      sessionStorage.removeItem(AUTH_KEY);
      return true;
    }
  } catch {
    /* private mode / storage blocked */
  }
  return false;
}

export function setAuthenticated() {
  try {
    localStorage.setItem(AUTH_KEY, "1");
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    try {
      sessionStorage.setItem(AUTH_KEY, "1");
    } catch {}
  }
}

export function clearAuthenticated() {
  try {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  } catch {}
}
