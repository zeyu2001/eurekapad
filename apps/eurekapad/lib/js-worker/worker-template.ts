export const WORKER_TEMPLATE = `var window = self;

window.console = {
  log: function (...args) {
    _send(undefined, args.join(" "));
  },
  info: function (...args) {
    _send(undefined, args.join(" "));
  },
  warn: function (...args) {
    _send(new Error(args.join(" ")));
  },
  error: function (...args) {
    _send(new Error(args.join(" ")));
  },
};

window._originalSetTimeout = window.setTimeout;
window._originalClearTimeout = window.clearTimeout;
window._activeTimers = 0;

window.setTimeout = function (func, delay) {
  window._activeTimers++;
  return window._originalSetTimeout(function() {
    func();
    window._activeTimers--;
  }, delay);
};

window.clearTimeout = function (timerID) {
  window._activeTimers--;
  window._originalClearTimeout(timerID);
};

window._originalSetInterval = window.setInterval;
window._originalClearInterval = window.clearInterval;
window._activeIntervals = 0;
window.setInterval = function (func, delay) {
  if (func && delay) {
    window._activeIntervals++;
  }
  return window._originalSetInterval(function() {
    func();
    window._activeIntervals--;
  }, delay);
};
window.clearInterval = function (intervalId) {
  // JQuery sometimes hands in true which doesn't count
  if (intervalId !== true) {
    window._activeIntervals--;
  }
  return window._originalClearInterval(intervalId);
};

(function () {
  let runningAsyncTasks = 0;

  const originalThen = Promise.prototype.then;
  Promise.prototype.then = function (onFulfilled, onRejected) {
    runningAsyncTasks++;
    return originalThen.call(this, (value) => {
      runningAsyncTasks--;
      return onFulfilled ? onFulfilled(value) : value;
    }, (error) => {
      runningAsyncTasks--;
      return onRejected ? onRejected(error) : Promise.reject(error);
    });
  };

  globalThis.isAsyncRunning = () => runningAsyncTasks > 0;
})();

function _send(error, stdout, reportSendError, completed) {
  try {
    postMessage({
      stdout: stdout,
      error: error
        ? { name: error.name, message: error.message, stack: error.stack }
        : undefined,
      completed: completed,
    });
  } catch (err) {
    if (reportSendError !== false) _send(err, undefined, false);
  }
}

self.addEventListener("unhandledrejection", function (e) {
  e.preventDefault();
  _send(e.reason);
});

onmessage = async function (evt) {
  let result, error;
  try {
    await (FUNCTION_PLACEHOLDER).apply(undefined, evt.data);
  } catch (err) {
    error = err;
  } finally {
    _send(error);
  }

  while (window._activeTimers !== 0 || window._activeIntervals !== 0 || isAsyncRunning()) {
    await new Promise(resolve => window._originalSetTimeout(resolve, 100));
  }
  _send(undefined, undefined, undefined, true);
};
`
