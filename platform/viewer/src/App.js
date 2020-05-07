import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ThemeWrapper } from '@ohif/ui';

import { ServicesManager } from '@ohif/core';
import routes from './routes';

const servicesManager = new ServicesManager();

function App({ config, defaultExtensions, defaultModes }) {
  const appDefaultConfig = {
    showStudyList: true,
    extensions: [],
    modes: [],
    dataSources: [DicomWebDataSource],
    routerBasename: '/',
  };

  const appConfig = {
    ...appDefaultConfig,
    ...(typeof config === 'function' ? config({ servicesManager }) : config),
  };

  const { extensions, modes, dataSources } = appConfig;

  _initExtensions(
    [...defaultExtensions, ...extensions],
    cornerstoneExtensionConfig,
    this._appConfig
  );

  const {
    servers,
    hotkeys: appConfigHotkeys,
    cornerstoneExtensionConfig,
    extensions,
    oidc,
  } = this._appConfig;

  const { routerBasename } = config;
  const Router = JSON.parse(process.env.USE_HASH_ROUTER)
    ? HashRouter
    : BrowserRouter;

  appConfig.modes = [...appConfig.modes, ...defaultModes];

  config.return(
    <Router basename={routerBasename}>
      <ThemeWrapper>{routes(config)}</ThemeWrapper>
    </Router>
  );
}

App.propTypes = {
  config: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      routerBasename: PropTypes.string.isRequired,
      oidc: PropTypes.array,
      whiteLabeling: PropTypes.shape({
        createLogoComponentFn: PropTypes.func,
      }),
      extensions: PropTypes.array,
    }),
  ]).isRequired,
  /* Extensions that are "bundled" or "baked-in" to the application */
  defaultExtensions: PropTypes.array,
};

App.defaultProps = {
  config: {
    showStudyList: true,
    oidc: [],
    extensions: [],
  },
  defaultExtensions: [],
};

export default App;
