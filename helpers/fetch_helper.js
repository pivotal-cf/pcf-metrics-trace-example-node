import 'isomorphic-fetch';
import wrapFetch from 'zipkin-instrumentation-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error
  }
}

function fetchWithTracer(url, options = {}) {
  const {tracer, ...opts} = options;
  if (!tracer) return fetch(url, opts);
  return wrapFetch(fetch, options)(url, opts);
}

export function fetchText(url, options = {}) {
  return fetchWithTracer(url, options)
    .then(checkStatus)
    .then(r => r.text());
}