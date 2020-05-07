/**
 * Entry point for development and production PWA builds.
 * Packaged (NPM) builds go through `index-umd.js`
 */
import 'regenerator-runtime/runtime';
import App from './App.js';
import React from 'react';
import ReactDOM from 'react-dom';

import DefaultMode from '@ohif/mode-example';
import DICOMWebDataSource from '@ohif/datasource-dicomweb';

/** Combine our appConfiguration and "baked-in" extensions */
const appProps = {
  config: window ? window.config : {},
  defaultExtensions: [],
  defaultModes: [[DefaultMode, {}]],
  defaultDataSources: [
    DICOMWebDataSource,
    {
      name: 'DCM4CHEE',
      wadoUriRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/wado',
      qidoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
      wadoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
      qidoSupportsIncludeField: true,
      imageRendering: 'wadors',
      thumbnailRendering: 'wadors',
      enableStudyLazyLoad: true,
    },
  ],
};

/** Create App */
const app = React.createElement(App, appProps, null);

/** Render */
ReactDOM.render(app, document.getElementById('root'));
