import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { setBaseUrls } from './helpers/baseUrl';

let xhrConfig;

const fetchConfig = () =>
  new Promise((resolve, reject) => {
    xhrConfig = new XMLHttpRequest();
    xhrConfig.open('GET', '/config.json', true);
    xhrConfig.setRequestHeader('Cache-Control', 'no-cache');
    xhrConfig.onload = resolve;
    xhrConfig.onerror = reject; // () => reject(xhrConfig.statusText); //  console.error(xhrConfig.statusText);
    xhrConfig.send(null);
  });

function onConfigResult(config) {
  // set base properties
  setBaseUrls({
    baseUrl: config.baseUrlForApi,
  });
}

function requestOnLoad() {
  if (xhrConfig.readyState === 4 && xhrConfig.status === 200) {
    let serverConfig = JSON.parse(xhrConfig.responseText);
    onConfigResult(serverConfig);

    ReactDOM.render(
      <React.StrictMode>
        <React.Suspense fallback='loading...'>
          <App />
        </React.Suspense>
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
}

fetchConfig()
  .then(requestOnLoad)
  .catch(() => console.log('Something was wrong'));
