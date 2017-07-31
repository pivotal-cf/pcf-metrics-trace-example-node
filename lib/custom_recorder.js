export default class CustomRecorder {
  /* eslint-disable no-console */
  constructor(logger = console.log) {
    this.logger = logger;
  }
  record(rec) {
    const id = rec.traceId;
    this.logger(
      `[${id.parentId},${id.traceId},${id.spanId},true] ${rec.annotation.toString()}`
    );
  }

  toString() {
    return 'consoleTracer';
  }
}