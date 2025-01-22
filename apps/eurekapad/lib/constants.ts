/* Pyodide Kernel Constants
/* -------------------------------------------------------------------------- */

import * as pypiUrls from '@jupyterlite/pyodide-kernel/lib/_pypi'

for (const [_key, _value] of Object.entries(pypiUrls)) {
  // This forces webpack to bundle all the whl files
}

const PYODIDE_CDN_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full'

export const PYODIDE = {
  PYODIDE_URL: `${PYODIDE_CDN_BASE}/pyodide.js`,
  LOCKFILE_URL: `${PYODIDE_CDN_BASE}/pyodide-lock.json`,
  // @ts-expect-error: this is a module
  ALL_JSON_URL: pypiUrls.allJSONUrl.default,
  PIPLITE_WHEEL_URL: pypiUrls.pipliteWheelUrl.default,
}

/* -------------------------------------------------------------------------- */
