import React from 'react';
import ReactDOM from 'react-dom/client';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const muiSwitchWidgetDef = {
  id: 'hcl.leap.sample.MuiSwitch',
  version: '0.1.0',
  apiVersion: '1.0.0',
  label: {
    'default': 'Switch'
  },
  description: {
    'default': 'Switch',
  },
  datatype: {
    type: 'boolean'
  },
  category: {
    id: 'hcl.leap.sample.widgets',
    label: {
      'default': 'Leap Samples'
    }
  },
  iconClassName: 'hcl-leap-sample-switchIcon',
  builtInProperties: [
    { id: 'title' }, { id: 'required' }, { id: 'seenInOverview', defaultValue: true }
  ],
  properties : [],

  // initialize widget in the DOM, with initial properties and event callbacks
  instantiate: (metadata, domNode, initialProps, eventManager) => {
    let reactRoot = null;
    let checked = false;
    let label = '';

    const render = () => {
      reactRoot.render(
        <React.StrictMode>
          <FormControlLabel control={<Switch checked={checked} />} label={label} onChange={(event) => {
            checked = event.target.checked;
            eventManager.sendEvent('onChange');
            render();
          }} />
        </React.StrictMode>
      );
    };

    const rootNode = document.createElement('div');
    domNode.appendChild(rootNode);
    reactRoot = ReactDOM.createRoot(rootNode);
    label = initialProps.title;
    render();

    const widgetInstance = {

      /** must be supplied for Leap to get widget's data value */
      getValue: () => {
        return checked;
      },

      /** must be supplied for Leap to set widget's data value */
      setValue: (val) => {
        checked = val;
        render();
      },

      /** called when properties change in the authoring environment */
      setProperty: (propName, propValue) => {
        if (propName === 'title') {
          label = propValue;
          render();
        }
      },

      /** for app authors to programatically interact with widget */
      getJSAPIFacade: () => {
        var facade = {
          _self: this,
          setLabel: function (label) {
            this._self.setProperty('title', label);
          }
        }
        return facade;
      }
    };

    return widgetInstance;
  }
};

export { muiSwitchWidgetDef };