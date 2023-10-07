# HCL Leap - Custom Widget API (v1.0.0)

This API provides a mechanism to incorporate custom widgets into the HCL Leap product.

- [Getting Started](#getting-started)
  - [Product Configuration](#product-configuration)
  - [Registering a Widget](#registering-a-widget)
- [Data Widgets vs Display Widgets](#data-widgets-vs-display-widgets)
- [Data Types](#data-types)
  - [`'string'`](#string)
  - [`'boolean'`](#boolean)
  - [`'number'`](#number)
  - [`'date'`](#date)
  - [`'time'`](#time)
  - [`'timestamp'`](#timestamp)
- [Rules](#rules)
  - [Display Widgets](#display-widgets)
  - [Data Widgets](#data-widgets)
- [Built-In Properties](#built-in-properties)
- [Custom Properties](#custom-properties)
- [Widgets with Options](#widgets-with-options)
  - [Author-Defined Options](#author-defined-options)
  - [Hardcoded Options](#hardcoded-options)
  - [Multiple Selections](#multiple-selections)
- [Widget Instantiation](#widget-instantiation)
- [Validation](#validation)
- [Internationalization](#internationalization)
- [Usage of Leap JavaScript API](#usage-of-leap-javascript-api)
- [Versioning](#versioning)
- [Upgrading](#upgrading)
- [Security Considerations](#security-considerations)
- [Incorporating 3rd-party libraries](#incorporating-3rd-party-libraries)
- [Known Limitations](#known-limitations)
- [Full Example - Display Widget](#full-example---display-widget)
- [Full Example - Data Widget](#full-example---data-widget)
- [Full Example - React Material UI Widget](#full-example---react-material-ui-widget)

## Getting Started

### Product Configuration
Additional resources can be loaded into the Leap UI's by adding `ibm.nitro.NitroConfig.runtimeResources` properties to `Leap_config.properties`. These additional resources are expected to include definitions of your custom widgets and any auxiliary styles or libraries that are required to support them.
 
 For example:
``` properties
ibm.nitro.NitroConfig.runtimeResources.1 = \
  <link rel='stylesheet' type='text/css' media='screen' href='https://mywidgets.example.com/common.css'>; \n\
  <link rel='stylesheet' type='text/css' media='screen' href='https://mywidgets.example.com/MyYesNoWidget.css'>; \n\
  <script src='https://myWidgets.example.com/common.js'></script> \n\
  <script src='https://myWidgets.example.com/MyYesNoWidget.js'></script> \n
```


### Registering a Widget
As your custom .js is loaded into the page, it is expected to register one or more widget definitions:
``` javascript
const myWidgetDefinition = {...};
nitro.registerWidget(myWidgetDefintion);
```

Full descriptions and examples are provided below in this document; here is the basic skeleton of a custom widget:
``` javascript
const myWidgetDefinition = {
    id: 'example.YesNo', // uniquely identifies this widget
    version: '2.0.0', // the widget's version
    apiVersion: '1.0.0', // the version of this API
    label: 'Yes/No',
    description: 'Allows user to choose "Yes" or "No"',
    datatype: {
        type: 'string' // must be one of 'string', 'date', 'number', 'boolean', time, timestamp
    },
    // for placement in the palette
    category: {
        id: 'example.choice.widgets',
        label: 'Choice Components'
    },
    iconClassName: 'myYesNoIcon', // styling of this class expected in custom .css
    builtInProperties: [...], // use existing properties: 'title', 'required', etc
    properties: [...], // custom properties, of prescribed types

    // called by Leap to initialize widget in the DOM with initial properties, and set-up event handling
    instantiate: function (context, domNode, initialProps, eventManager) {
        return {
             // (optional) for display in various parts of the UI
            getDisplayTitle: function () {
                return ...
            },

            // (required) for Leap to get widget's data value
            getValue: function () {
                return ...
            },

            // (required) for Leap to set widget's data value
            setValue: function (val) {
                ...
            },

            // (optional) for additional validation of value
            validateValue: function (val) {
                // return true, false, or custom error message
            },

            // (required) called when properties change in the authoring environment, or via JavaScript API
            setProperty: function (propName, propValue) {
                ...
            },

            // (optional) method to enable/disable widget
	        setDisabled: function (isDisabled) {
                ...
            },

            // (optional) determines what the author can do with the widget via custom JavaScript
            getJSAPIFacade: function () {
                return {
                    ...
                 };
            }
        };
    }
};
```
## Data Widgets vs Display Widgets
Some widgets are for collecting data (ie. "data widgets") and others are presentational in nature (ie. "display widgets").  
  
A data widget is required to:
- declare a `datatype` property (described below)
- provide `setValue()` and `getValue()` functions
- publish an `onChange` event when its value is changed by the user. This will trigger a call to the widget's `getValue()` function, and `validateValue()` function if supplied

Some display widgets are still expected to trigger events (ex `onClick`), which can be used by the app author to invoke an action, by custom JavaScript or other techniques. 

## Data Types
Data widgets can declare one of the following data types, each with additional optional constraints. Constraints on the data type goes beyond the UI. These constraints will be enforced when data is submitted to the server. 

### `'string'`

- A piece of text
- Constraints
  - `length` - the max number of characters allowed, including multi-byte charaters. Note, if this length is greater than `255` the submitted value will be stored as `CLOB` in the database and will not be sortable. Default value: `50`
  - `subType`
    - Email
    - URL
  - `format` - limit user's input to specific format, use # for numbers 0-9, @ for letters A-Z and ? for number or letter
     - `simplePattern` 
     - `invalidMessage`

Example: 
``` javascript
const myWidgetDefinition = {
   ...
   datatype: {
     type: 'string',
     length: 50,
     format: {
        simplePattern: '#####,#####-####' // US zip code
        invalidMessage: 'Please enter a valid US zip code'
     }
   }
   ...
};
```

### `'boolean'`
- a `true` or `false` value. A `null` value is not supported. The default value is `false`
- Constraints: 
  - none

### `'number'`
- a number  
- Contraints:  
    - `numberType`: one of `'decimal'` or `'integer'`. Default: `'decimal'`
    - `decimalPlaces`: if number is a `'decimal'`, will round to the given number of decimal places. Default: `2`
    - `minValue` : minimum value of number expected. Can be omitted or set to `null` if no minimum
    - `maxValue` : maximum value of number expected. Can be omitted or set to `null` if no maximum

Example: 
``` javascript
const myWidgetDefinition = {
   ...
   datatype: {
     type: 'number',
     numberType: 'decimal',
     decimalPlaces: 2
   }
   ...
};
```


### `'date'`
- a date-only value in `'YYYY-MM-DD'` string format
- custom widgets are expected to handle the setting of the date in a `'YYYY-MM-DD'` string format, or as a `Date` object.
- Contraints: 
    - `minValue` : minimum value of date expected. Can be omitted or set to `null` if no minimum
    - `maxValue` : maximum value of date expected. Can be omitted or set to `null` if no maximum

### `'time'`
- a time-only value in `'hh:mm'` string format (24-hour clock)
- Contraints:
    - `minValue` : minimum value of time expected. Can be omitted or set to `null` if no minimum
    - `maxValue` : maximum value of time expected. Can be omitted or set to `null` if no maximum

### `'timestamp'`
- a date-time value in ISO 8601  `'YYYY-MM-DDThh:mmZ'` string format, normalized to the UTC timezone (denoted by `Z`)
- custom widgets are expected to handle the setting of the date ISO 8601  `'YYYY-MM-DDThh:mmZ'` format, or as a `Date` object.
- Constraints:
    - `minValue` : minimum value of time stamp expected. Can be omitted or set to `null` if no minimum
    - `maxValue` : maximum value of time stamp expected. Can be omitted or set to `null` if no maximum


## Rules
App authors will be able to incorporate custom widgets in rules, as follows: 
### Display Widgets
- Actions:
  - Show
  - Hide
### Data Widgets
- Actions:
  - Show
  - Hide
  - Enable
  - Disable
  - Valid
  - Not Valid
  - Required
  - Not Required
- Condition Operators
  -  based on widget's datatype


## Built-In Properties
Some properties that already exist in the product are general purpose, or, are integral to the proper functioning of a widget. The following built-in properties are supported for custom widgets: 
- **`'required'`**: For data widgets, allows the app author to ensure that a value is collected. Requiredness will be enforced beyond the UI; the integrity of the data will be enforced when it is submitted to the server
- **`'title'`**: This is used in various contexts to allow for editing and display of the name of a widget instance
- **`'seenInOverview'`**:  Allows the app author to decide if the widget's data should be displayed in the *View Data* page.

Example: 
``` javascript
const myWidgetDefinition = {
    ...
    builtInProperties : [{ id: 'required'}, {id: 'title'}, {id: 'seenInOverview', defaultValue: true}],
    ...
}
```

**Note**: All widgets will be implicitly given an `ID` property. The default value of this property will be auto-incrementing unique value based on the widget definition's `label`. For example, a widget with a label of `'Yes/No'` will result in a default ID of `'F_YesNo1'`.  Similar to Leap's built-in widgets, the app author is free to alter the ID to suit their needs.


## Custom Properties
The custom widget can define an array of custom properties for the app author to modify. Each property is an `object` with the following attributes:
- `id`: (required) uniquely identifies this property for this widget
- `label`: (required) the property's label
- `propType`: (required) one of:
    - `'string'`: rendered as a textbox
    - `'string-multiline'`: rendered as a textarea
    - `'enum'`: rendered as a dropdown. must be accompanied by a `values` attribute (see example below)
    - `'boolean'`: rendered as a checkbox
    - `'number'` : rendered as a number input, for any number
    - `'integer'` : rendered as a number input, for integers only
    - `'customOptions'` : see below 
- `values`: required if `propType` is `'enum'` (see example below)
- `defaultValue` : (optional) the property's default value
- `constraints` : (optional)
    - `min`: (optional) minimum allowed property value for numbers
    - `max`: (optional) maximum allowed property value for numbers


Example:
```javascript
const myWidgetDefintion = {
  ...
  properties: [
    ...
    {
      id: 'messageType',
      label:  'Message Type',
      propType: 'enum',
      values: [{title: 'Information', value: 'info'}, {title: 'Warning', value: 'warn'}, {title: 'Error', value: 'error'}],
      defaultValue: 'info'
    },
    ... 
  ],
  ...
};
```

## Widgets with Options
Widgets that allow the end-user to select from a set of options require specific treatment. This includes widgets such as dropdowns, radio groups, or checkbox groups. These options could be hardcoded in the custom widget, or defined by the app author.

### Author-Defined Options
If a widget requires app authors to define their own options, define a property with both `id` _and_  `propType` set to a value of `"customOptions"`. For example,
```javascript
const myWidgetDefintion = {
    ...
    properties: [
        {
            id: "customOptions",
            propType: "customOptions",
            label: "Options"
        },
        ...
    ],
    ...
```
**Note**: An id of `'customOptions'` is meaningful to Leap. All other custom property id's are arbitrary.

### Hardcoded Options
If the widget's options are hardcoded, add a `getOptions()` function to your widget.
For example:
```javascript
const myWidgetDefintion = {
    ...
    getOptions : function () {
	    return [{title: 'Yes', value: 'yes'}, {title: 'No', value: 'no'}];
    },
    ...
};
```
### Multiple Selections
If your widget allows end-users to select multiple options (ie. a checkbox group), set the `isMultiSelect` attribute of the widget to `true`
```javascript
const myWidgetDefintion = {
    ...
    isMultiSelect: true
    ...
}
```
When `isMultiSelect` is `true`, it is expected that the widget's `getValue()` function will return an _Array_ of values. Similarly, the widget's `setValue()` function will be passed an _Array_ of values.  
**Note**: The `isMultiSelect` flag is only supported for `string` data type and widgets with options.


## Widget Instantiation
The widget's `instantiate()` function is called when an instance of the custom widget needs to be created. The function is expected to return an `object` that allows Leap to interact with the instantiated widget.
  
`instantiate()` is called with the following arguments:
- `context`: an `object` containing useful meta-data, including:
    - `locale`: the locale of current page. This is useful for displaying messages in the correct language or for dealing with locale preferences (ex. number formatting)
    - `mode`: one of `'design'` (authoring), `'preview'` (previewing), or `'run'` (running app). The widget's behaviour may need to be tailored based on the context, for example disabling some behaviours in `'design'` mode. 
- `domNode`:  The parent DOM node into which the widget's DOM must be placed. The custom widget code must not manipulate the parent node or anything outside of it.
- `initialProps`: These will be the initial set of property values as chosen by the app author.
- `eventManager`: for triggering events. For example, `eventManager.fireEvent('onChange')`

The returned `object` is expected to supply the following functions: 
- `getValue()`: required for data widgets
- `setValue(value)`: required for data widgets
- `setProperty(propName, propValue)`: required for all widgets
- `getDisplayTitle()`: (optional) - for display widget's title in various parts of the UI
- `setDisabled(isDisabled)`: (optional) - to tailor the widget's behaviour when disabled and enabled
- `setErrorMessage(errorMessage)`: (optional) - for the widget to report validation errors. `errorMessage` will be `null` if the data is valid.
- `setRequired(isRequired)`: (optional) - to tailor the widget's behaviour when the data is required, or not required.
- `getOptions()`: (optional) - see "Widgets with Options"
- `validateValue(value)`: (optional) - see "Validation" below
- `getJSAPIFacade()`: optional. Returns an object that supplies additional custom functions that will be available to app authors to use in their custom JavaScript. Special care must be taken to ensure that app authors have a limited range of possibilities and cannot take over the whole page with their custom JavaScript. When Leap's secure sandbox mode is enabled (`secureJS=true`), an author's custom JavaScript cannot access any variables prefixed with a double-underscore (see full example below).

The widget creator is free to decide how they want to code and manage the widget instance internally.

## Validation
Some intrinsic validation will be done according to the `type` and `constraints` declared in the widget's `datatype` property; however, it might be necessary for a widget to supply its own custom validation logic. This can be done by supplying a `validateValue()` function, which returns one of the following values: 
- `null` - indicates the value is valid
- an error message - the returned error message will be displayed to the app user in some contexts (ex. when attempting to go the next page). 

It is responsibility of the custom widget to render itself appropriately based on its state of validity. Note, the widget's `setErrorMessage` function will be triggered whenever the validity changes, due to contraints on the `datatype` or custom validation from the `validateValue()` function.  
**Note**: Any additional validation provided by the custom widget via a `validateValue()` function will not be enforced on the server; however, it will prevent the form from being submitted by the user in the browser.


## Internationalization
Certain attributes of the widget definition can be displayed to app authors working in different locales. To support multiple languages during authoring, some properties can be specified as "multi-string" objects rather than a plain `string` values.  
For example: 
``` javascript
  label: 'Yes/No',
```
can be written as
``` javascript
  label: {
    "default": 'Yes/No',
    "fr": 'Oui/No',
    "de": 'Ja/Nein'
  },
```
The property names are expected to match the `lang` attribute of the current HTML page.
For example, `"fr": 'Oui/No'` matches  `<html lang="fr">`.  
If there is no match, then the `"default"` property will be used as a fallback.

The following widget attributes are globalizable:
- `label`
- `description`
- `category > label` 
- `properties > (property) > label`
- `properties > (property) > defaultValue`
- `properties > (property) > options > (option) > title`


## Usage of Leap JavaScript API
Custom widgets can use Leap's JavaScript API to help achieve their objectives.
The API is can be accessed via the global `NitroApplication` object or by the passed-in `context` object.
For example, the following is a widget that renders itself appropriately based on the form's currently selected page:
``` javascript
const myPageNavigator = {
    ...
    instantiate: function (context, domNode) {
        if (context.mode === 'run' || context.mode === 'preview') {
            const currentPage = context.page;
            context.form.getPageIds().forEach((pageId) => {
                const page = context.form.getPage(pageId);
                const btn = document.createElement('button');
                btn.innerHTML = makeHTMLSafe(page.getTitle());
                if (page === currentPage) {
                    btn.setAttribute('disabled', 'true');
                } else {
                    btn.addEventListener('click', () => {
                        context.form.selectPage(pageId);
                    });
                }
                domNode.appendChild(btn);                    
            });
        } else {
            ...
        }
        return { ... };
    }
}
```

## Versioning
The widget's `version` must follow "Semantic Versioning" ([semver.org](https://semver.org/)) practices of `MAJOR.MINOR.PATCH`. The following behaviours are expected:
- `PATCH` increment (ex. 1.0.0 > 1.0.1)
   - for backwards compatible bug fixes
   - **Authors**: Any widgets already declared with the same minor version will automatically start using the newest patch version. Newly added widgets will use the newest patch version.
   - **End-Users**: Any widgets declared with the same minor version will automatically start using the newest patch version.
- `MINOR` increment (ex. 1.0.1 > 1.1.0)
   - for new functionality that is backwards compatible
   - **Authors**: Any widgets already declared with the same major version will automatically start using the newest minor version. Newly added widgets will use the new minor version. New *optional* widget properties might appear to the app author.
   - **End-Users**: Any widgets declared with the same major version will automatically start using the newest minor version. End-users might experience some noticeable improvements.
- `MAJOR` increment (ex. 1.1.0 > 2.0.0)
   - for major changes that are not backwards compatible
   - **Authors**: Any widgets already declared with a different major version will remain at that major version. The declaration of previous major versions of widgets must be retained by the customer or failures may occur. The customer will decide which major versions of the widget will display on the palette. See "Upgrading" below for more information.
   - **End-Users**: Any widgets already declared with a different major version will remain at that major version. The declaration of previous major versions of widgets must be retained by the customer or failures may occur. See "Upgrading" below for more information.

Note: This Custom Widget API will also follow "semver" practices.

## Upgrading
The exact techniques for upgrading widgets from one major version to the next has not yet been established. The intention is to solicit feedback from the community on how best to achieve this.

## Security Considerations

1. It is the responsibility of the widget creator to avoid script injection attacks by ensuring that values are sanitized or escaped properly before placing them into the DOM. In general, the widget creator is responsible for following secure engineering practices.

1. The custom widget code has full access to the page, but it should not call product functions, manipulate the product's JavaScript values, or interact with the product's DOM nodes in any way that is not prescribed by this API. Doing so could jeporadize the security of the product and break your custom widgets in future product releases.

1. As stated above, special care must be taken when supplying a `getJSAPIFacade()`  function to expose additional widget capabilities for app authors to leverage in their custom JavaScript. These functions should provide tightly constrained interactions with the custom widget, with no possibility for script injection or access to the widget's internal objects or its DOM, or those of the product. The "facade" naming is a reminder that the app author's code should only get references to values and objects that are necessary and "safe".
  
1. It is the responsibility of widget creators and Leap administrators to ensure that only trusted stable resources are loaded into Leap's pages. The specified additional resources will be loaded directly into the user's browser (by injecting them as-written into the `<head>` of the page). There will be no additional vetting or sanitizing of resources by Leap. It is not recommended for a customer to rely on resources that they do not tightly control (ie. avoid usage of libraries from a 3rd-party CDN).
  
1. Strict CSP support requires a special `nonce='#!#cspNonce!#!'` attribute on `<script>` tags.For example:
``` properties
ibm.nitro.NitroConfig.runtimeResources.4 = <script nonce='#!#cspNonce!#!' src='https://myWidgets.example.com/MyYesNoWidget.js'></script>
```


## Incorporating 3rd-party libraries
- 3rd-party libraries are expected to be bundled and loaded in an isolated manner so that they do not pollute the global namespace or interfere with the product code, in the current release or future releases
- Usage of the product's 3rd-party libraries is not supported; these may change or be removed at any time.

## Known Limitations
- **Complex Data**: Widgets that need to store complex data are expected to use a "parsable" `string` value (ex. `JSON`). There is no mechanism to handle customized rendering of this value in some parts of the product (ex. Print View), or to customize searching/filtering based on the intricacies of the complex value.
- **Containers**: There is no support for custom container widgets, those being widgets that contain other widgets, such as a collapsible section.
- **Full Custom Properties**: There is no mechanism to supply 100% custom properties. Properties of the custom widget will be from a set of common prescribed types.
- **In-line Editing**: There is no mechanism to support the app author in direct in-line editing of a widget's properties on the canvas. 
- **Multilingual Apps**: There is no mechanism (beyond an app author's custom JavaScript) to allow app authors to supply property values for an application that is to be used by end-users who speak different languages.
- **Author-Defined Data Constraints** - There are limited mechanisms for app authors to define data constraints on the values supplied by end-users. Values can be constrained in the UI by the custom widget itself, or by the author's custom JavaScript.  




## Full Example - Display Widget
See [Acme_PageNavHeader_Widget.js](./samples/acme/Acme_PageNavHeader_Widget.js)  
Other examples will be coming soon to https://github.com/HCL-TECH-SOFTWARE
 
## Full Example - Data Widget
See 
[Acme_YesNo_Widget.js](./samples/acme/Acme_YesNo_Widget.js)  
Other examples will be coming soon to https://github.com/HCL-TECH-SOFTWARE

## Full Example - React Material UI Widget
Coming soon to https://github.com/HCL-TECH-SOFTWARE


