import { React, Component, useState } from 'react';

import StudyListContainer from './routes/StudyListContainer';
import NotFound from './routes/NotFound';

function getMode(id) {
  const mode = window.modes.find(a => {
    return a.id === id;
  });

  if (!mode) {
    throw new Error(`Mode not found for id ${id}`);
  }

  return mode;
}

function getDataSource(id) {
  const dataSource = window.dataSources.find(a => {
    return a.id === id;
  });

  if (!dataSource) {
    throw new Error(`DataSource not found for id ${id}`);
  }

  return dataSource;
}

function getSOPClassHandler(id) {
  const sopClassHandler = window.sopClassHandlers.find(a => {
    return a.id === id;
  });

  if (!sopClassHandler) {
    throw new Error(`SOPClassHandler not found for id ${id}`);
  }

  return sopClassHandler;
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

class SOPClassHandlerManager() {
  constructor(sopClassHandlerIds) {
    this.SOPClassHandlers = sopClassHandlerIds.map(getSOPClassHandler);
  }

  async createDisplaySets() {
    const SOPClassHandlers = this.SOPClassHandlers;

    const displaySets = [];
    StudyMetadata.forEachSeries(series => {
      for (let i = 0; i < SOPClassHandlers.length; i++) {
        const handler = SOPClassHandlers[i];

        // TODO: This step is still unclear to me
        const displaySet = handler(series);

        if (displaySet) {
          displaySets.push(displaySet);
        }
      }
    });

    return displaySets;
  }
}

function ModeRoute({ match: routeMatch, location: routeLocation }) {
  const {
    modeId
    dataSourceId,
  } = routeMatch.params;

  const modeRoute = 'default';

  const [displaySets, setDisplaySets] = useState([]);
  const { routes, sopClassHandlers } = getMode(modeId);

  // Only handling one route per mode for now
  const ModeComponent = routes[0].layoutTemplate;

  const dataSource = getDataSource(dataSourceId);
  const queryParams = location.search;

  // Add SOPClassHandlers to a new SOPClassManager.
  const manager = new SOPClassHandlerManager(sopClassHandlers);

  // Call the data source to start building the view model?
  dataSource(queryParams, onUpdatedCallback);

  const onUpdatedCallback = () => {
    // TODO: This should append, not create from scratch so we don't nuke existing display sets
    // when e.g. a new series arrives
    manager.createDisplaySets.then(setDisplaySets);
  }

  const ExtensionContexts = () => {this}

  /*
  TODO: How are contexts provided by extensions passed into the mode?
   
  return (
    <ExtensionContexts>
      <ModeComponent displaySets={displaySets} setDisplaySets={setDisplaySets}/>
    </ExtensionContexts>
  );*/

  return (
    <ModeComponent displaySets={displaySets} setDisplaySets={setDisplaySets}/>
  )
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
