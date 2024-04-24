import Chart from "chart.js/auto";

if (typeof leapSample === 'undefined') {
    leapSample = {}; // use an isolated namespace
};


leapSample.donutWidget = {
    id: "leapSample.leap.sample.chartJS",
    version: "1.0.0",
    apiVersion: "1.0.0",
    label: {
        "default": "ChartJS Widget",
        "it": "Esempio ChartJS Widget",
    },
    description: {
        "default": "Provides a way to create ChartJS chartsr",
        "it": "Il nuovo  ChartJS Widget",
        "fr": "Le nouveau widget pour faire des chartsJS"
    },
    category: {
        id: "hcl.leap.sample.widgets",
        label: {
            "default": "ChartJS",
            "it": "ChartJS",
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
            id: "customAttribute"
        },
        {
            id: "seenInOverview",
            defaultValue: true
        }
    ],
    properties: [
        {
            id: "debugFlag",
            propType: "boolean",
            label: {
                "default": "Enable Debug",
                "it": "Abilita debug"
            },
            defaultValue: {
                "default": false
            }
        },
        {
            id: "theWidth",
            propType: "string",
            label: {
                "default": "Width (px or %)",
                "it": "Larghezza (px o %)"
            },
            defaultValue: "100%"
        },
        {
            id: "theHeight",
            propType: "string",
            label: {
                "default": "Height (px or %)",
                "it": "Altezza (px or %)"
            },
            defaultValue: "100%"
        }, 
        {
            id: "chartType",
            propType: 'enum', 
            values: [{title: 'Donut', value: 'doughnut'}, {title: 'Bar chart', value: 'bar'}, {title: 'Pie chart', value: 'pie'}, {title: 'Polar', value: 'polarArea'}, {title: 'Line chart', value: 'line'}],
            label: {
                "default": "Chart Type",
                "it": "Tipo di Chart"
            },
            defaultValue: "pie"
        },       
        {
            id: "labels",
            propType: "string",
            label: {
                "default": "Labels",
                "it": "labels"
            },
            defaultValue:  "blue, red, orange, yellow, green, purple, grey"
        },        
        {
            id: "colors",
            propType: "string",
            label: {
                "default": "Colors",
                "it": "Colori"
            },
            defaultValue:  "blue, red, orange, yellow, green, purple, grey"
        },        
        {
            id: "datasetLabel",
            propType: "string",
            label: {
                "default": "Dataset Label",
                "it": "Etichetta Dataset"
            },
            defaultValue: "The Value"
        }, 
        {
            id: "explanationText",
            propType: "string",
            label: {
                "default": "OnHover Description",
                "it": "Descrizione OnHover"
            },
            defaultValue: "OnHover Text"
        }
    ],

    // initialize widget in the DOM, with initial properties and event callbacks
    instantiate: function (context, domNode, initialProps, eventManager) {
        let widgetInstance = {
            _mode: null,
            _flexNode: null,
            _fieldsetNode: null,
            _legendNode: null,
            _debugFlag: true,
            _theId: context.id,
            _theCanvas: null,
            _theChart: null,
            _datasetLabel: null,
            _chartType: null,
            /**
             * IMPORTANT: Avoids script injection
             */
            _sanitizeHTML: function (str) {
                let s = '' + str;
                s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                return s;
            },
            _debugMsg: function(ctx, msg) {
                if (ctx._debugFlag) console.log(ctx._theId + msg);
            },
            //
            // internal method for creating and initializing the widget
            //
            _init: function (context, domNode, initialProps, eventManager) {
                if (initialProps.debugFlag && (initialProps.debugFlag === true)) console.log(JSON.stringify(initialProps, ' ', 4));
                this._mode = context.mode;
                const isDisabled = this._mode === 'design';
                const groupName = this._sanitizeHTML(context.id);

                const widgetHTML = '' +
                    '<fieldset>\n' +
                    '   <legend></legend>\n' +
                    '   <div class="flex-wrapper">\n' +
                    '       <canvas id=id="chartJS_' + Date.now() + '"></canvas>\n' +
                    '   </div>\n' +
                    '</fieldset>';

                domNode.innerHTML = widgetHTML;
                this._fieldsetNode = domNode.firstChild;
                this._legendNode = this._fieldsetNode.querySelector('legend');
                this._flexNode = this._fieldsetNode.querySelector('.flex-wrapper');
                this._theCanvas = this._flexNode.querySelector('canvas');
                this._theChart = new Chart(this._theCanvas,
                    {
                        type: 'doughnut',
                        data: {
                            labels: ['blue', 'red', 'orange', 'yellow', 'green', 'purple', 'grey'],
                            datasets: [{
                                label: '# of Votes',
                                data: [12, 19, 3, 5, 2, 3, 8],
                                backgroundColor: ["red", "red", "red", "red", "red", "red", "red"],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                //
                // set initial prop values
                //
                Object.keys(initialProps).forEach((propName) => {
                    this._setProp({propName: propName, propValue: initialProps[propName]});
                });
                //
                // propagate events
                //
                this._theCanvas.addEventListener("click", () => {
                    this._debugMsg(this, '.clickListener: CLICK EVENT');
                    eventManager.sendEvent('onClick');
                });
/*
                this._theCanvas.addEventListener("input", function() {
                    // will trigger call to getValue()
                    // this._debugMsg(this, '.changeListener: CHANGE EVENT');
                    //eventManager.sendEvent('onChange');
                });
                this._theCanvas.addEventListener("focus", () => {
                    //ithis._debugMsg(this, '.changeListener: FOCUS  EVENT');
                    //eventManager.sendEvent('onFocus');
                });
                this._theCanvas.addEventListener("blur", () => {
                    //this._debugMsg(this, '.changeListener: BLUR EVENT');
                    //eventManager.sendEvent('onBlur');
                });
                this._theCanvas.addEventListener("mouseover", () => {
                    //ithis._debugMsg(this, '.changeListener: MOUSEOVER EVENT');
                    //alert('INPUT ' + this._valueNode.value);
                    //if (this._debugFlag) console.log(this._valueNode);
                    //eventManager.sendEvent('onMouseOver');
                });
                this._theCanvas.addEventListener("mouseout", () => {
                    //this._debugMsg(this, '.changeListener: MOUSEOUT EVENT');
                    //eventManager.sendEvent('onMouseOut');
                });
                */
            },
            // internal custom mechanics for changing widget props
            _setProp: function ({propName, propValue}) {
                this._debugMsg(this, '._setProp: Setting ' + propName + ' to ' + propValue);
                switch (propName) {
                    case "title":
                        this._legendNode.innerHTML = this._sanitizeHTML(propValue);
                        break;
                    case "explanationText":
                        this._fieldsetNode.setAttribute('title', this._sanitizeHTML(propValue));
                        break;
                    case "theWidth":
                        this._theCanvas.style["width"] = this._sanitizeHTML(propValue);
                        break;
                    case "theHeight":
                        this._theCanvas.style["height"] = this._sanitizeHTML(propValue);
                        break;
                    case "chartType":
                        this._chartType = this._sanitizeHTML(propValue);
                        this._theChart.config.type = this._chartType;
                        if (this._chartType === 'polarArea') {
                            delete(this._theChart.config.options.scales.y);
                            this._theChart.config.options.scales.r = {beginAtZero: true};
                        } else {
                            delete(this._theChart.config.options.scales.r);
                            this._theChart.config.options.scales.y = {beginAtZero: true};
                        }
                        if (this._chartType === 'line') {
                            this._theChart.config.data.datasets[0].borderWidth = 7;
                        } else {
                            this._theChart.config.data.datasets[0].borderWidth = 1;
                        }
                        this._theChart.update();
                        break;
                    case "data":
                        if (!Array.isArray(propValue)) {
                            propValue = propValue.replace(/\s/g, '');
                            propValue = propValue.split(',');
                        }
                        this._debugMsg(this, '._setProp: data to ' + propValue);
                        this._theChart.config.data.datasets[0].data = propValue;
                        this._theChart.update();
                        break;
                    case "labels":
                        if (!Array.isArray(propValue)) {
                            //
                            //  Transform to Array
                            //
                            propValue = propValue.replace(/\s/g, '');
                            propValue = propValue.split(',');
                        }
                        this._debugMsg(this, '._setProp: labels to ' + propValue);
                        if (propValue.join(',') === this._theChart.config.data.labels.join(',')) {
                            //
                            //  nothing changed
                            //
                            this._debugMsg(this, '._setProp: labels : NOTHING to set. Same value');
                        } else {
                            //
                            //  Changing...
                            //
                            this._theChart.config.data.labels = propValue;
                            this._theChart.update();
                        }
                        break;
                    case "colors":
                        if (!Array.isArray(propValue)) {
                            //
                            //  Transform to Array
                            //
                            propValue = propValue.replace(/\s/g, '');
                            propValue = propValue.split(',');
                        }
                        this._debugMsg(this, '._setProp: colors to ' + propValue);
                        if (propValue.join(',') === this._theChart.config.data.datasets[0].backgroundColor.join(',')) {
                            //
                            //  nothing changed
                            //
                            this._debugMsg(this, '._setProp: labels : NOTHING to set. Same value');
                        } else {
                            //
                            //  Changing...
                            //
                            this._theChart.config.data.datasets[0].backgroundColor = propValue;
                            this._theChart.update();
                        }
                        break;
                    case "datasetLabel":
                        this._datasetLabel = this._sanitizeHTML(propValue);
                        this._theChart.config.data.datasets[0].label = this._datasetLabel;
                        this._theChart.update();
                        break;
                    case "debugFlag":
                        this._debugFlag = propValue;
                        break;
                    default:
                        // ignore
                        break;
                }
            },
            //
            // for display in various parts of the UI
            //
            getDisplayTitle: function () {
                this._debugMsg(this, '.getDisplayTitle : ' + this._legendNode.innerHTML);
                return this._legendNode.innerHTML;
            },
             //
            // called when properties change in the authoring environment, or via JavaScript API
            //
            setProperty: function (propName, propValue) {
                this._debugMsg(this, '.setProperty ' + propName + ' to ' + propValue);
                this._setProp({propName, propValue});
            },
            //
            // determines what the author can do with the widget via custom JavaScript
            //
            getJSAPIFacade: function () {
                this._debugMsg(this, '.getJSAPIFacade: defining FACADE');
                const facade = {
                    __self: this, // double-underscore keeps this private
                    setTitle: function (theTitle) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setTitle : ' + theTitle);
                        this.__self._setProp({propName: 'title', propValue: theTitle});
                    },
                    setWidth: function(theWidth) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setWidth to ' + theWidth);
                        this.__self._setProp({propName: 'theWidth', propValue: theWidth});
                    },
                    getWidth: function() {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getWidth to ' + this.__self._theCanvas.style["width"]);
                        return this.__self._theCanvas.style["width"];
                    },
                    setHeight: function(theHeight) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setHeight to ' + theHeight);
                        this.__self._setProp({propName: 'theHeight', propValue: theHeight});
                    },
                    getHeight: function() {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getHeight to ' + this.__self._theCanvas.style["height"]);
                        return this.__self._theCanvas.style["height"];
                    },
                    setChartType: function(theType) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setChartType to ' + theType);
                        this.__self._setProp({propName: 'chartType', propValue: theType});
                    },
                    getChartType: function() {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getChartType for ' + this.__self._chartType);
                        return this.__self._chartType;
                    },
                    getChartTypes: function() {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getChartTypes for ....');
                        return [{title: 'Donut', value: 'doughnut'}, {title: 'Bar chart', value: 'bar'}, {title: 'Pie chart', value: 'pie'}, {title: 'Polar', value: 'polarArea'}, {title: 'Line chart', value: 'line'}];
                    },
                    setData: function (dataArray) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setData to ' + dataArray);
                        this.__self._setProp({propName: 'data', propValue: dataArray});
                    },
                    getData: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getData for ' + this.__self._theChart.config.data.datasets[0].data.join(','));
                        return this.__self._theChart.config.data.datasets[0].data;
                    },
                    setLabels: function (labelsArray) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setLabels to ' + labelsArray);
                        this.__self._setProp({propName: 'labels', propValue: labelsArray});
                     },
                    geLabels: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getLabels for ' + this.__self._theChart.config.data.labels.join(','));
                        return this.__self._theChart.config.data.labels;
                    },
                    setColors: function (labelsArray) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setColors to ' + labelsArray);
                        this.__self._setProp({propName: 'colors', propValue: labelsArray});
                     },
                    getColors: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getColors for ' + this.__self._theChart.config.data.datasets[0].backgroundColor.join(','));
                        return this.__self._theChart.config.data.datasets[0].backgroundColor;
                    },
                    setDatasetLabel: function (theLabel) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setDatasetLabel to ' + theLabel);
                        this.__self._setProp({propName: 'datasetLabel', propValue: theLabel});
                     },
                    getDatasetLabel: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getDatasetLabel for ' + this.__self._theChart.config.data.datasets[0].label);
                        return this.__self._theChart.config.data.datasets[0].label;
                    },
                    setDebugFlag: function(debugFlag) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setDebugFlag to ' + debugFlag);
                        this.__self._setProp({propName: 'debugFlag', propValue: debugFlag});
                    },
                    getDebugFlag: function() {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getDebugFlag for ' + this.__self._debugFlag);
                        return this.__self._debugFlag;
                    }
                }
                return facade;
            }
        };
       widgetInstance._init(context, domNode, initialProps, eventManager);
       return widgetInstance;
    }
};
nitro.registerWidget(leapSample.donutWidget);