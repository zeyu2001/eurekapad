export const WORKER_TEMPLATE = `var window = self;

window.console = {
  log: function (...args) {
    send(undefined, args.join(" "));
  },
  info: function (...args) {
    send(undefined, args.join(" "));
  },
  warn: function (...args) {
    send(new Error(args.join(" ")), undefined);
  },
  error: function (...args) {
    send(new Error(args.join(" ")), undefined);
  },
};

function send(error, stdout, reportSendError) {
  try {
    postMessage({
      stdout: stdout,
      error: error
        ? { name: error.name, message: error.message, stack: error.stack }
        : undefined,
    });
  } catch (err) {
    if (reportSendError !== false) send(err, undefined, false);
  }
}

self.addEventListener("unhandledrejection", function (e) {
  e.preventDefault();
  send(e.reason, undefined);
});

onmessage = function (evt) {
  let result, error;
  try {
    (FUNCTION_PLACEHOLDER).apply(undefined, evt.data);
  } catch (err) {
    error = err;
  }
  send(error, undefined);
};
`
