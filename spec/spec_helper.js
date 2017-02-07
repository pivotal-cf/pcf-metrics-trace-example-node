import 'babel-polyfill';
import JasmineAsyncSuite from 'jasmine-async-suite';

JasmineAsyncSuite.install();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;

afterAll(() => {
  JasmineAsyncSuite.uninstall();
});