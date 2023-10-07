if (typeof leapSample === 'undefined') {
    leapSample = {}; // use an isolated namespace
}

/**
 * Displays a message to the end-user of type success, info, warn, or error.
 */
leapSample.notificationWidget = {
    id: 'hcl.leap.sample.Notification',
    version: '1.0.0',
    apiVersion: '1.0.0',
    label: 'Notification (Sample)',
    description: 'Displays a message to the end-user of type success, information, warning, or error.',
    category: {
        id: 'hcl.leap.sample.widgets',
        label: 'Leap Samples',
    },
    iconClassName: 'leapSampleNotificationIcon',
    properties: [{
        id: 'heading',
        propType: 'string',
        label: 'Heading',
        defaultValue: 'Lorem Ipsum'
    },
    {
        id: 'content',
        propType: 'string-multiline',
        label: 'Message Text',
        defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id: 'type',
        propType: 'enum',
        values: [{
            title: 'Success',
            value: 'success'
        },
        {
            title: 'Information',
            value: 'info'
        },
        {
            title: 'Warning',
            value: 'warn'
        },
        {
            title: 'Error',
            value: 'error'
        },
        ],
        label: 'Type',
        defaultValue: 'info'
    },

    ],

    // initialize widget in the DOM
    instantiate: function (context, domNode, initialProps, eventManager) {
        const widgetInstance = {
            _notificationNode: null,
            _headingNode: null,
            _contentNode: null,

            /**
             * Called when properties change in the authoring environment (and from getJSAPIFacade below)
             */
            setProperty: function (propName, propValue) {
                switch (propName) {
                    case 'heading':
                        this._headingNode.innerHTML = this._sanitizeHTML(propValue);
                        break;
                    case 'type':
                        this._notificationNode.className = `leapSampleNotification ${propValue}`;
                        break;
                    case 'content':
                        this._contentNode.innerHTML = this._sanitizeHTML(propValue);
                        break;
                    default:
                        // ignore
                        break;
                }
            },

            /**
             * IMPORTANT: Avoids script injection
             */
            _sanitizeHTML: function (str) {
                let s = '' + str;
                s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                return s;
            },

            /**
             * Internal initialization of widget instance.
             */
            _init: function (context, domNode, initialProps, eventManager) {
                domNode.innerHTML = '' +
                    '<div class="leapSampleNotification">' +
                    '  <h2 class="leapSampleHeading"><!-- heading will go here --></h2>' +
                    '  <p class="leapSampleContent"><!-- message content will go here --></p>' +
                    '</div>';

                this._notificationNode = domNode.firstChild;
                this._headingNode = this._notificationNode.querySelector(':scope h2');
                this._contentNode = this._notificationNode.querySelector(':scope p');

                // set initial prop values
                Object.keys(initialProps).forEach((propName) => {
                    this.setProperty(propName, initialProps[propName]);
                });
            },

            /** 
             * Allows app authors to set properties dynamically via custom JavaScript
             */
            getJSAPIFacade: function () {
                const facade = {
                    __self: this, // IMPORTANT: double-underscore keeps this private
                    setHeading: function (heading) {
                        this.__self.setProperty('heading', heading);
                    },
                    setType: function (type) {
                        if (!['success', 'info', 'warn', 'error'].includes(type)) 
                            return; // not a valid type
                        this.__self.setProperty('type', type);
                    },
                    setContent: function (content) {
                        this.__self.setProperty('content', content);
                    }
                }
                return facade;
            }
        };
        widgetInstance._init(context, domNode, initialProps, eventManager);
        return widgetInstance;
    }
}

nitro.registerWidget(leapSample.notificationWidget);