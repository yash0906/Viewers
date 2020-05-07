import { React, Component, useState } from 'react';

import StudyListContainer from './routes/StudyListContainer';
import NotFound from './routes/NotFound';

function getMode(id) {
  const mode = window.modes.find(a => {
    return a.id === id;
  });

  if (!mode) {
    throw new Error(`Mode not found for modeId ${id}`);
  }

  return mode;
}

function getDataSource(id) {
  const dataSource = window.dataSources.find(a => {
    return a.id === id;
  });

  if (!dataSource) {
    throw new Error(`DataSource not found for dataSourceId ${id}`);
  }

  return dataSource;
}

/*const ViewModelContext = React.createContext(
  displaySets: [],
  setDisplaySets: () => {}
);


class ViewModelProvider extends Component {
  state = {
    displaySets: []
  };

  const setDisplaySets = displaySets => {
    this.setState({displaySets});
  };

  render() {
    return (
      <ViewModelContext.Provider value={
        displaySets: this.state.displaySets,
        setDisplaySets
      }>
        {this.props.children}
      </ViewModelContext.Provider>
    );
  }
}*/

function ModeRoute({ match: routeMatch, location: routeLocation }) {
  const {
    modeId
    dataSourceId,
  } = routeMatch.params;

  const [displaySets, setDisplaySets] = useState([]);
  const ModeComponent = getMode(modeId).component;
  const dataSource = getDataSource(dataSourceId);
  const queryParams = location.search;

  // Call the data source to start building the view model?
  dataSource(queryParams, setDisplaySets);

  // SOPClassManager?

  return (
    <ExtensionContexts>
      <ModeComponent displaySets={displaySets} setDisplaySets={setDisplaySets}/>
    </ExtensionContexts>
  );
}

/*
  Routes uniquely define an entry point to:
  - A mode
  - Linked to a data source
  - With a specified data set.

  The full route template is:

  /:modeId/:modeRoute/:sourceType/?queryParameters=example

  Where:
  :modeId - Is the mode selected.
  :modeRoute - Is the route within the mode to select.
  :sourceType - Is the data source identifier, which specifies which DataSource to use.
  ?queryParameters - Are query parameters as defined by data source.

  A default source can be specified at the app level configuration, and then that source is used if :sourceType is omitted:

  /:modeId/:modeRoute/?queryParameters=example
 */
function buildModeRoutes(modes, dataSources) {
  const routes = [];
  const component = (<ModeRoute/>);

  modes.forEach(mode => {
    dataSources.forEach(dataSource => {
      const path = `/${mode.id}/${dataSource.id}`;

      routes.push({
        path: `/${mode.id}/${dataSource.id}`,
        component,
        exact: true
      });
    });
  });

  return routes;
}
