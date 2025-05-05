/* --------------------------------------------------------------------------
 * Pyodide Kernel Constants
 * -------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
 * Editor collaboration mode constants
 * -------------------------------------------------------------------------- */

export const cursorColors = [
  '#FF6B6B',
  '#6BCB77',
  '#4D96FF',
  '#FFD93D',
  '#FF6EC7',
  '#6B8EFF',
  '#FFB347',
  '#8AFF80',
  '#B388FF',
  '#FF8A65',
  '#64FFDA',
  '#F06292',
  '#7C4DFF',
  '#A1887F',
  '#00E676',
]

export const animalNames = [
  'Panda',
  'Koala',
  'Bunny',
  'Otter',
  'Fox',
  'Hedgehog',
  'Penguin',
  'Kitten',
  'Puppy',
  'Lamb',
  'Squirrel',
  'Raccoon',
  'Alpaca',
  'Sloth',
  'Chinchilla',
]
