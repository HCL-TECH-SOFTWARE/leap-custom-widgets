if (typeof leapSample === 'undefined') {
    leapSample = {}; // use an isolated namespace
}


leapSample.gaugeWidget = {
    id: "leapSample.leap.sample.Gauge",
    version: "1.0.0",
    apiVersion: "1.0.0",
    label: {
        "default": "Gauge Widget",
        "it": "Gauge widget",
    },
    description: {
        "default": "Displays a Gauge to display data",
        "it": "Il nuovo Gauge widget",
        "fr": "Le nouveau widget de type Gauge"
    },
    category: {
        id: "hcl.leap.sample.widgets",
        label: {
            "default": "Leap Samples",
            "it": "Esempi per Leap",
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
            id: "debugFlag",
            propType: "boolean",
            label: {
                "default": "Enable Debug",
                "it": "Abilita debug"
            },
            defaultValue: true
        },
        {
            id: "theData",
            propType: "number",
            label: {
                "default": "Gauge Value",
                "it": "Il Valore del Gauge"
            },
            defaultValue: 25,
            constraints: {
                "minValue": 0,
                "numberType": "integer"
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
                "minValue": 0,
                "numberType": "integer"
            }
        },
        {
            id: "poster",
            propType: "string",
            label: {
                "default": "Label",
                "it": "Etichetta"
            },
            defaultValue: "Sample"
        },
        {
            id: "strokeColor",
            propType: "string",
            label: {
                "default": "Stroke Color",
                "it": "Colore gauge"
            },
            defaultValue: "red"
        },
        {
            id: "gapColor",
            propType: "string",
            label: {
                "default": "Gap Color",
                "it": "Colore gap"
            },
            defaultValue: "rgb(238,238,238)"
        },
        {
            id: "widgetTextColor",
            propType: "string",
            label: {
                "default": "Widget Text Color",
                "it": "Colore testo gauge"
            },
            defaultValue: "#666"
        },
        {
            id: "isClickable",
            propType: "boolean",
            label: {
                "default": "Is Clickable",
                "it": "é cliccabile"
            },
            defaultValue: true
        },
        {
            id: "widgetFillColor",
            propType: "string",
            label: {
                "default": "Selected Widget Fill Color",
                "it": "Colore Background selezione"
            },
            defaultValue: "lightblue"
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
            _thePoster: null,
            _theScale: 100,
            _widgetFillColor: null,
            _valueNode: null,
            _posterNode: null,
            _strokeNode: null,
            _gapNode: null,
            _flexNode: null,
            _fieldsetNode: null,
            _legendNode: null,
            _debugFlag: true,
            _isClickable: true,
            _theId: context.id,           
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
                const groupName = this._sanitizeHTML(context.id);

                const widgetHTML = '' +
                    '<fieldset>\n' +
                    '   <legend></legend>\n' +
                    '   <div class="flex-wrapper">\n' +
                    '       <div id="gauge_' + Date.now() + '" class="single-chart">\n' +
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
                this._fieldsetNode = domNode.firstChild;
                this._legendNode = this._fieldsetNode.querySelector('legend');
                this._flexNode = this._fieldsetNode.querySelector('.flex-wrapper');
                this._posterNode = this._fieldsetNode.querySelector('.first-line');
                this._valueNode = this._fieldsetNode.querySelector('.second-line');
                this._strokeNode = this._fieldsetNode.querySelector('.circle');
                this._gapNode = this._fieldsetNode.querySelector('.circle-bg');
                // set initial prop values
                Object.keys(initialProps).forEach((propName) => {
                    this._setProp({propName: propName, propValue: initialProps[propName]});
                });

                // propagate events
                this._fieldsetNode.addEventListener("click", () => {
                    if (this._isClickable) {
                        this._debugMsg(this, '.clickListener: Honoring CLICK EVENT');
                        if (this._mode !== 'design') this.getJSAPIFacade().toggleSelection();
                        eventManager.sendEvent('onClick');
                    } else {
                        this._debugMsg(this, '.clickListener: IGNORING CLICK EVENT as this widget is in a NOT-CLICKABLE state');
                    }
                });
                /*
                this._fieldsetNode.addEventListener("change", () => {
                    // will trigger call to getValue()
                    this._debugMsg(this, '.changeListener: CHANGE EVENT');
                    eventManager.sendEvent('onChange');
                });
                 this._fieldsetNode.addEventListener("focus", () => {
                    //if (this._debugFlag) console.log(this._theId + '.focusListener: FOCUS EVENT');
                    //eventManager.sendEvent('onFocus');
                });
                this._fieldsetNode.addEventListener("blur", () => {
                    //if (this._debugFlag) console.log(this._theId + '.blurListener: BLUR EVENT');
                    //eventManager.sendEvent('onBlur');
                });
                this._fieldsetNode.addEventListener("focus", () => {
                    //if (this._debugFlag) console.log(this._theId + '.focusListener: FOCUS EVENT');
                    //eventManager.sendEvent('onFocus');
                });
                this._fieldsetNode.addEventListener("mouseover", () => {
                    //if (this._debugFlag) console.log(this._theId + '.mouseOverListener: MOUSEOVER EVENT');
                    //eventManager.sendEvent('onMouseOver');
                });
                this._fieldsetNode.addEventListener("mouseout", () => {
                    //if (this._debugFlag) console.log(this._theId + '.mouseOutListener: MOUSEOUT EVENT');
                    //eventManager.sendEvent('onMouseOut');
                });
                */
            },
            _setProp: function ({propName, propValue}) {
                this._debugMsg(this, '._setProp: Setting ' + propName + ' to ' + propValue);
                switch (propName) {
                    case "theData": 
                        this._valueNode.innerHTML = propValue;
                        let perc1 = (propValue * 120) / this._theScale;
                        this._strokeNode.style['stroke-dasharray'] = perc1 + ', 120';
                        break;
                    case "title":
                        this._legendNode.innerHTML = this._sanitizeHTML(propValue);
                        break;
                    case "explanationText":
                        this._fieldsetNode.setAttribute('title', propValue);
                        break;
                    case "scale":
                        this._theScale = propValue;
                        let perc = (this._valueNode.innerHTML * 120) / this._theScale;
                        this._strokeNode.style['stroke-dasharray'] = perc + ', 120';
                        //if (this._mode !== 'design') this._strokeNode.style['stroke-dasharray'] = perc + ', 120';
                        break;
                    case "poster":
                        this._posterNode.innerHTML = this._sanitizeHTML(propValue);
                        break;
                    case "strokeColor":
                        this._strokeNode.style['stroke'] = this._sanitizeHTML(propValue);
                        break;
                    case "gapColor":
                        this._gapNode.style['stroke'] = this._sanitizeHTML(propValue);
                        break;
                    case "widgetTextColor":
                        this._posterNode.style['fill'] = this._sanitizeHTML(propValue);
                        this._valueNode.style['fill'] = this._sanitizeHTML(propValue);
                        break;
                    case "widgetFillColor":
                        this._widgetFillColor = this._sanitizeHTML(propValue);
                        if (this._gapNode.style['fill'] !== '') this._gapNode.style['fill'] = this._widgetFillColor;
                         //this._strokeNode.style['fill'] = this._widgetFillColor;
                        //if (this._mode !== 'design') this._strokeNode.style['fill'] = this._widgetFillColor;
                        break;
                    case "debugFlag":
                        this._debugFlag = propValue;
                        break;
                    case "isClickable":
                        this._isClickable = propValue;
                        break;
                    default:
                        // ignore
                        break;
                }
            },
            // internal custom mechanics for getting widget props
            _getProp: function (propName) {
                this._debugMsg(this, '._getProp: Getting ' + propName + '...');
                switch (propName) {
                    case "theData": 
                        return this._valueNode.innerHTML;
                        break;
                    case "title":
                        return this._legendNode.innerHTML;;
                        break;
                    case "explanationText":
                        return this._fieldsetNode.getAttribute('title');
                        break;
                    case "scale":
                        return this._theScale;
                        break;
                    case "poster":
                        return this._posterNode.innerHTML;
                        break;
                    case "strokeColor":
                        return this._strokeNode.style['stroke'];
                        break;
                    case "gapColor":
                        return this._gapNode.style['stroke'];
                        break;
                    case "widgetTextColor":
                        return this._valueNode.style['fill'];
                        break;
                    case "widgetFillColor":
                        return this._widgetFillColor;
                        break;
                    case "debugFlag":
                        return this._debugFlag;
                    case "isClickable":
                        return this._isClickable;
                    default:
                        return null;
                        // ignore
                        break;
                }
            },
            //
            // for display in various parts of the UI
            //
            getDisplayTitle: function () {
                this._debugMsg(this, '.getDisplayTitle : ' + this._getProp('title'));
                return this._getProp('title');
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
                    getTitle: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getTitle for ' + this.__self._getProp('title'));
                        return this.__self._getProp('title');
                    },
                    setValue: function (theData) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setValue : ' + theData);
                        this.__self._setProp({propName: 'theData', propValue: theData});
                    },
                    getValue: function() {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getValue for ' + this.__self._valueNode.innerHTML);
                        return this.__self._valueNode.innerHTML;
                    },
                    setLabel: function (label) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setLabel : ' + label);
                        this.__self._setProp({propName: 'poster', propValue: label});
                    },
                    getLabel: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getLabel for ' + this.__self._getProp('poster'));
                         return this.__self._getProp('poster');
                    },
                    setScale: function (scale) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setScale : ' + scale);
                        this.__self._setProp({propName: 'scale', propValue: scale});
                    },
                    getScale: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getScale for ' + this.__self._getProp('scale'));
                        return this.__self._getProp('scale');
                    },
                    setTextColor: function (theColor) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setTextColor : ' + theColor);
                        this.__self._setProp({propName: 'widgetTextColor', propValue: theColor});
                    },
                    getTextColor: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getTextColor for ' + this.__self._getProp('widgetTextColor'));
                        return this.__self._getProp('widgetTextColor');
                    },
                    setStrokeColor: function (theColor) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setStrokeColor : ' + theColor);
                        this.__self._setProp({propName: 'strokeColor', propValue: theColor});
                    },
                    getStrokeColor: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getStrokeColor for ' + this.__self._getProp('strokeColor'));
                        return this.__self._getProp('strokeColor');
                    },
                    setGapColor: function (theColor) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setGapColor : ' + theColor);
                        this.__self._setProp({propName: 'gapColor', propValue: theColor});
                    },
                    getGapColor: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getGapColor for ' + this.__self._getProp('gapColor'));
                        return this.__self._getProp('gapColor');
                    },
                    setFillColor: function (theColor) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setFillColor : ' + theColor);
                        this.__self._setProp({propName: 'widgetFillColor', propValue: theColor});
                    },
                    getFillColor: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getFillColor for ' + this.__self._getProp('widgetFillColor'));
                        return this.__self._getProp('widgetFillColor');
                    },
                    setClickable: function(isClickable) {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: setClickable to ' + isClickable);
                        this.__self._setProp({propName: 'isClickable', propValue: isClickable});
                    },
                    getClickable: function() {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: getClickable for ' + this.__self._getProp('isClickable'));
                        return this.__self._getProp('isClickable');
                    },
                    selectWidget: function () {
                        if (this.__self._isClickable) {
                            if (this.__self._gapNode.style['fill'] === '') {
                                this.__self._debugMsg(this.__self, '.getJSAPIFacade: selectWidget : selecting Widget...');
                                this.__self._gapNode.style['fill'] = this.__self._widgetFillColor;
                            } else {
                                this.__self._debugMsg(this.__self, '.getJSAPIFacade: selectWidget : Widget ALREADY selected');
                            }
                        } else {
                            this.__self._debugMsg(this.__self, '.getJSAPIFacade: selectWidget : widget is NOT CLICKABLE! This operation is ignored !');
                        }
                    },
                    unselectWidget: function () {
                        if (this.__self._isClickable) {
                            if (this.__self._gapNode.style['fill'] === '') {
                                this.__self._debugMsg(this.__self, '.getJSAPIFacade: unselectWidget : Widget ALREADY unselected');
                            } else {
                                this.__self._debugMsg(this.__self, '.getJSAPIFacade: unselectWidget : unselecting Widget...');
                                this.__self._gapNode.style['fill'] = '';                        
                            }
                        } else {
                            this.__self._debugMsg(this.__self, '.getJSAPIFacade: unselectWidget : widget is NOT CLICKABLE! This operation is ignored !');                           
                        }
                    },
                    toggleSelection : function () {
                        if (this.__self._isClickable) {
                            if (this.__self._gapNode.style['fill'] === '') {
                                this.__self._debugMsg(this.__self, '.getJSAPIFacade: toggleSelection ON');
                                this.__self._gapNode.style['fill'] = this.__self._widgetFillColor;
                            } else {
                                this.__self._debugMsg(this.__self, '.getJSAPIFacade: toggleSelection OFF');
                                this.__self._gapNode.style['fill'] = '';
                            }
                        } else {
                            this.__self._debugMsg(this.__self, '.getJSAPIFacade: toggleSelection : widget is NOT CLICKABLE! This operation is ignored !');                           
                        }
                    },
                    isWidgetSelected: function () {
                        this.__self._debugMsg(this.__self, '.getJSAPIFacade: isWidgetSelected...');
                        if (this.__self._gapNode.style['fill'] === '') {
                            return false;
                        } else {
                            return true;
                        }
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
nitro.registerWidget(leapSample.gaugeWidget);
