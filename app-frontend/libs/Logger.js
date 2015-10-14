const STYLE = `
  font-weight: bold;
  color: purple;
`;

function noop() {}

class Logger {
  constructor(name = "default") {
    this.name = name;
    this.log = this.log.bind(this);
    this.info = __DEV__ ? this.info.bind(this) : noop;
    this.warn = __DEV__ ? this.warn.bind(this) : noop;
    this.error = this.error.bind(this);
    this.trace = __DEV__ ? this.trace.bind(this) : noop;
  }

  log(level = "log", ...args) {
    console[level].call(console, `%c[${this.name}]`, STYLE, ...args);
  }

  info(...args) {
    this.log("info", ...args);
  }

  warn(...args) {
    this.log("warn", ...args);
  }

  error(...args) {
    this.log("error", ...args);
  }

  trace(...args) {
    this.log("trace", ...args);
  }
}

const defaultLogger = new Logger();

export default {
  create(name) {
    return new Logger(name);
  },
  log: defaultLogger.log,
  info: defaultLogger.info,
  warn: defaultLogger.warn,
  error: defaultLogger.error,
  trace: defaultLogger.trace
};
