if (typeof acme1 === 'undefined') {
    acme1 = {}; // use an isolated namespace
};

acme1.makeHTMLSafe = function (str) {
    if (!str) return str;
    var s = str.replace(/&/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/'/g, '&#39;');
    s = s.replace(/"/g, '&quot;');
    return s;
};


acme1.gaugeWidget = {
    id: "acme1.theGauge",
    version: "1.0.0",
    apiVersion: "1.0.0",
    label: {
        "default": "ACME Gauge Widget",
        "it": "ACME Widget Gauge",
    },
    description: {
        "default": "ACME The new Gauge widget",
        "it": "Il nuovo Gauge widget di ACME",
        "fr": "Le nouveau widget de type Gauge de ACME"
    },
    datatype: {
        type: 'number',
        numberType: 'decimal',
        defautValue: 25,
        minValue: 0
    },
    category: {
        id: "acme1-gauge-widgets",
        label: {
            "default": "Gauges",
            "it": "Gauges",
        }
    },
    formPalette: true,
    appPagePalette: true,
    iconClassName: "checkmarkIcon",
    builtInProperties: [{
            id: "title"
        },
        {
            id: "id",
        },
        {
            id: "required",
        },
        {
            id: "seenInOverview",
            defaultValue: true
        }
    ],
    properties: [
        {
            id: "explanationText",
            propType: "string",
            label: {
                "default": "Explanation Text",
                "nl": "Uitleg tekst"
            },
            defaultValue: {
                "default": "Some default explanation text",
                "nl": "Een standaard uitlegtekst"
            }
        },
        {
            id: "poster",
            propType: "string",
            label: {
                "default": "Poster",
                "it": "Etichetta"
            },
            defaultValue: {
                "default": "This Sample",
                "it": "questo esempio"
            }
        },
        {
            id: "scale",
            propType: "number",
            label: {
                "default": "Gauge Scale",
                "it": "La Scale del Gauge"
            },
            defaultValue: 100,
            constraints: {
                "minValue": 0
            }
        },
        {
            id: "strokeColor",
            propType: "string",
            label: {
                "default": "Stroke Color",
                "it": "Colore gauge"
            },
            defaultValue: {
                "default": "red"
            }
        },
        {
            id: "widgeTextColor",
            propType: "string",
            label: {
                "default": "Widget Text Color",
                "it": "Colore testo gauge"
            },
            defaultValue: {
                "default": "#666"
            }
        },
        {
            id: "widgetFillColor",
            propType: "string",
            label: {
                "default": "Selected Widget Fill Color",
                "it": "Colore Background selezione"
            },
            defaultValue: {
                "default": "lightblue"
            }
        }
    ],

    // initialize widget in the DOM, with initial properties and event callbacks
    instantiate: function (context, domNode, initialProps, eventManager) {
        let widgetInstance = {
            _mode: null,
            _thePoster: null,
            _theScale: 100,
            _widgetFillColor: null,
            _valueNode: null,
            _posterNode: null,
            _strokeNode: null,
            _flexNode: null,
            _radioGroupNode: null,
            _legendNode: null,

            // internal custom mechanics for changing widget props
            _setProp: function ({
                propName,
                propValue
            }) {
                console.log('theGauge._setProp: Setting ' + propName + ' to ' + propValue);
                switch (propName) {
                    case "title":
                        this._legendNode.innerHTML = acme1.makeHTMLSafe(propValue);
                        break;
                    case "explanationText":
                        this._radioGroupNode.setAttribute('title', propValue);
                        break;
                    case "scale":
                        this._theScale = propValue;
                        let perc = (this._valueNode.innerHTML * 120) / this._theScale;
                        if (this._mode !== 'design') this._strokeNode.style['stroke-dasharray'] = perc + ', 120';
                        break;
                    case "poster":
                        this._posterNode.innerHTML = acme1.makeHTMLSafe(propValue);
                        break;
                    case "strokeColor":
                        this._strokeNode.style['stroke'] = acme1.makeHTMLSafe(propValue);
                        break;
                    case "widgetTextColor":
                        this._posterNode.style['fill'] = acme1.makeHTMLSafe(propValue);
                        this._valueNode.style['fill'] = acme1.makeHTMLSafe(propValue);
                        break;
                    case "widgetFillColor":
                        this._widgetFillColor = acme1.makeHTMLSafe(propValue);
                        // if (this._mode !== 'design') this._strokeNode.style['fill'] = this._widgetFillColor;
                        break;
                    default:
                        // ignore
                        break;
                }
            },

            // internal method for creating and initializing the widget
            _init: function (context, domNode, initialProps, eventManager) {
                this._mode = context.mode;
                //const isDisabled = this._mode === 'design';
                const isDisabled = false;
                const groupName = acme1.makeHTMLSafe(context.id);

                const widgetHTML = '' +
                    '<fieldset>\n' +
                    '   <legend></legend>\n' +
                    '   <div class="flex-wrapper">\n' +
                    '       <div id="submitted-gauge" class="single-chart">\n' +
                    '           <svg viewBox="0 0 42 42" class="circular-chart">\n' +
                    '               <path class="circle-bg" d="M21 1.9014' +
                    '                   a 19.0986 19.0986 0 0 1 0 38.197' +
                    '                   a 19.0986 19.0986 0 0 1 0 -38.197">\n' +
                    '               </path>\n' +
                    '               <path class="circle" stroke-dasharray="30, 120" d="M21 1.9014' +
                    '                   a 19.0986 19.0986 0 0 1 0 38.197' +
                    '                   a 19.0986 19.0986 0 0 1 0 -38.197">\n' +
                    '               </path>\n' +
                    '               <text x="21" y="17.35" class="percentage first-line" style="font-size: 0.4em;">' + 'UNDEF' + '</text>\n' +
                    '               <text x="21" y="26.35" class="percentage second-line" style="font-size: 0.7em;">' + 25 + '</text>\n' +
                    '           </svg>\n' +
                    '       </div>\n' +
                    '   </div>\n' +
                    '</fieldset>';

                domNode.innerHTML = widgetHTML;
                this._radioGroupNode = domNode.firstChild;
                this._legendNode = this._radioGroupNode.querySelector('legend');
                this._flexNode = this._radioGroupNode.querySelector('.flex-wrapper');
                this._posterNode = this._radioGroupNode.querySelector('.first-line');
                this._valueNode = this._radioGroupNode.querySelector('.second-line');
                this._strokeNode = this._radioGroupNode.querySelector('.circle');
                // set initial prop values
                Object.keys(initialProps).forEach((propName) => {
                    this._setProp({
                        propName: propName,
                        propValue: initialProps[propName]
                    });
                });

                // propagate events
                this._radioGroupNode.addEventListener("change", () => {
                    // will trigger call to getValue()
                    console.log('theGauge.changeListener: CHANGE EVENT');
                    eventManager.sendEvent('onChange');
                });
                this._radioGroupNode.addEventListener("click", () => {
                    console.log('theGauge.clickListener: CLICK EVENT');
                    if (this._mode !== 'design') {
                        if (this._strokeNode.style['fill'] === '') {
                            this._strokeNode.style['fill'] = this._widgetFillColor;
                        } else {
                            this._strokeNode.style['fill'] = '';
                        }
                    }
                    eventManager.sendEvent('onClick');
                });
                this._radioGroupNode.addEventListener("focus", () => {
                    //console.log('theGauge.focusListener: FOCUS EVENT');
                    eventManager.sendEvent('onFocus');
                });
                this._radioGroupNode.addEventListener("blur", () => {
                    //console.log('theGauge.blurListener: BLUR EVENT');
                    eventManager.sendEvent('onBlur');
                });
                this._radioGroupNode.addEventListener("focus", () => {
                    //console.log('theGauge.focusListener: FOCUS EVENT');
                    eventManager.sendEvent('onFocus');
                });
                this._radioGroupNode.addEventListener("mouseover", () => {
                    //console.log('theGauge.mouseOverListener: MOUSEOVER EVENT');
                    eventManager.sendEvent('onMouseOver');
                });
                this._radioGroupNode.addEventListener("mouseout", () => {
                    //console.log('theGauge.mouseOutListener: MOUSEOUT EVENT');
                    eventManager.sendEvent('onMouseOut');
                });
            },

            // for display in various parts of the UI
            getDisplayTitle: function () {
                console.log('theGauge.getDisplayTitle : ' + this._legendNode.innerHTML);
                return this._legendNode.innerHTML;
            },

            // must be supplied for Leap to get widget's data value
            getValue: function () {
                console.log('theGauge.getValue: ');
                return this._valueNode.innerHTML;
            },

            // must be supplied for Leap to set widget's data value
            setValue: function (val) {
                console.log('theGauge.setValue: ' + val);
                this._valueNode.innerHTML = val;
                let perc = (val * 120) / this._theScale;
                this._strokeNode.style['stroke-dasharray'] = perc + ', 120';
            },

            // called when properties change in the authoring environment, or via JavaScript API
            setProperty: function (propName, propValue) {
                this._setProp({
                    propName,
                    propValue
                });
            },

            setDisabled: function (isDisabled) {
                // TODO - to be implemented
            },

            getOptions: function () {
                return null;
            },

            // determines what the author can do with the widget via custom JavaScript
            getJSAPIFacade: function () {
                console.log('theGauge.getJSAPIFacade: defining FACADE');
                const facade = {
                    __self: this, // double-underscore keeps this private
                    setTitle: function (theTitle) {
                        console.log('theGauge.getJSAPIFacade: setTitle : ' + theTitle);
                        this.__self._setProp({
                            propName: 'title',
                            propValue: theTitle
                        });
                    },
                    setPoster: function (label) {
                        console.log('theGauge.getJSAPIFacade: setPoster : ' + label);
                        this.__self._setProp({
                            propName: 'poster',
                            propValue: label
                        });
                    },
                    setScale: function (scale) {
                        console.log('theGauge.getJSAPIFacade: setScale : ' + scale);
                        this.__self._setProp({
                            propName: 'scale',
                            propValue: scale
                        });
                    },
                    setTextColor: function (theColor) {
                        console.log('theGauge.getJSAPIFacade: setTextColor : ' + theColor);
                        this.__self._setProp({
                            propName: 'widgetTextColor',
                            propValue: theColor
                        });
                    },
                    setStrokeColor: function (theColor) {
                        console.log('theGauge.getJSAPIFacade: setStrokeColor : ' + theColor);
                        this.__self._setProp({
                            propName: 'strokeColor',
                            propValue: theColor
                        });
                    },
                    setFillColor: function (theColor) {
                        console.log('theGauge.getJSAPIFacade: setFillColor : ' + theColor);
                        this.__self._setProp({
                            propName: 'widgetFillColor',
                            propValue: theColor
                        });
                    },
                    selectWidget: function () {
                        if (this.__self._strokeNode.style['fill'] === '') {
                            console.log('theGauge.getJSAPIFacade: selectWidget');
                            this.__self._strokeNode.style['fill'] = this.__self._widgetFillColor;
                        } else {
                            console.log('theGauge.getJSAPIFacade: selectWidget : ALREADY SELECTED');
                        }
                    },
                    unselectWidget: function () {
                        if (this.__self._strokeNode.style['fill'] === '') {
                            console.log('theGauge.getJSAPIFacade: unselectWidget : ALREADY UNSELECTED');
                        } else {
                            console.log('theGauge.getJSAPIFacade: unselectWidget');
                            this.__self._strokeNode.style['fill'] = '';                        
                        }
                    },
                    toggleSelection : function () {
                        console.log('theGauge.getJSAPIFacade: toggleSelection ');
                        if (this.__self._strokeNode.style['fill'] === '') {
                            this.__self._strokeNode.style['fill'] = this.__self._widgetFillColor;
                        } else {
                            this.__self._strokeNode.style['fill'] = '';
                        }
                    },
                    isWidgetSelected: function () {
                        console.log('theGauge.getJSAPIFacade: isWidgetSelected');
                        if (this.__self._strokeNode.style['fill'] === '') {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                return facade;
            }
        };
        widgetInstance._init(context, domNode, initialProps, eventManager);
        return widgetInstance;
    }
};
nitro.registerWidget(acme1.gaugeWidget);