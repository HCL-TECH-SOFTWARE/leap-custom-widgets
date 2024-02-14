import React from 'react';
import ReactDOM from 'react-dom/client';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Rating from '@mui/material/Rating';


const muiRatingWidgetDef = {
  id: "hcl.leap.sample.MUIRating",
  version: "0.1.0",
  apiVersion: "1.0.0",
  label: {
    "default": "Rating"
  },
  description: {
    "default": "Rating",
  },
  datatype: {
    type: "number" 
  },
  category: {
    id: "hcl.leap.sample.widgets",
    title: {
      "default": "Leap Samples"
    }
  },
  iconClassName: "hcl-leap-sample-ratingIcon",
  builtInProperties: [
    { id: 'title' }, { id: 'required' }, { id: 'seenInOverview', defaultValue: true }
  ],
  properties : [],
  
  /** initialize widget in the DOM, with initial properties and event callbacks */
  instantiate: function (metadata, domNode, initialProps, eventManager) {
    let reactRoot = null;
    let value = null;
    let title = '';

    const render = () => {
      reactRoot.render(
        <React.StrictMode>
          <FormControl>
            <FormLabel id={`${metadata.id}rating_label`}>{title}</FormLabel>
            <Rating aria-labelledby={`${metadata.id}rating_label`} precision={0.5} value={value} onChange={(event, newValue) => {
              value = newValue;
              eventManager.sendEvent('onChange');
              render();
            }} />
          </FormControl>
        </React.StrictMode>
      );
    }

    const rootNode = document.createElement('div');
    domNode.appendChild(rootNode);
    reactRoot = ReactDOM.createRoot(rootNode);
    title = initialProps.title;
    render();

    const widgetInstance = {

      /** must be supplied for Leap to get widget's data value */
      getValue: () => {
        return value;
      },

      /** must be supplied for Leap to set widget's data value */
      setValue: (val) => {
        value = val;
        render();
      },

      /** called when properties change in the authoring environment */
      setProperty: (propName, propValue) => {
        if (propName === 'title') {
          title = propValue;
          render();
        }
      },

      getDisplayTitle: () => {
        return title;
      },

      /** for app authors to programatically interact with widget */
      getJSAPIFacade: () => {
        var facade = {
          _self: this, // prevents access to the actual widget
          setTitle: function (title) {
            this._self.setProperty('title', title);
          }
        }
        return facade;
      }
    };

    return widgetInstance;
  }
};

export { muiRatingWidgetDef };