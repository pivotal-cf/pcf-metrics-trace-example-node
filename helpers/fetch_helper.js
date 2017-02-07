import 'isomorphic-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  };
}

export function fetchText(...args) {
  return fetch(...args)
    .then(checkStatus)
    .then(r => r.text());
}