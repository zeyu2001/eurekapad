export const NEW_TRANSCRIPTION_TEXT =
  "Start recording to begin a new transcription.";

const PYODIDE_CDN_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full";

export const PYODIDE = {
  PYODIDE_URL: `${PYODIDE_CDN_BASE}/pyodide.js`,
  LOCKFILE_URL: `${PYODIDE_CDN_BASE}/pyodide-lock.json`,
  ALL_JSON_URL: "/_next/static/pypi/all.json",
  PIPLITE_WHEEL_URL: "/_next/static/pypi/piplite-0.4.1-py3-none-any.whl",
};

export const UPDATE_THROTTLE_DELAY = 1000;
