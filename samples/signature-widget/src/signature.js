import SignaturePad from "signature_pad";

/**
 * IMPORTANT: Avoids script injection
 */
const sanitizeHTML = (str) => {
    let s = '' + str;
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

/**
 * Displays a message to the end-user of type info, warn, or error.
 */
const signatureWidget = {
    id: 'hcl.leap.sample.Signature',
    version: '0.1.0',
    apiVersion: '1.0.0',
    label: 'Signature (Sample)',
    description: 'Captures a user\'s signature',
    category: {
        id: 'hcl.leap.sample.widgets',
        label: 'Leap Samples',
    },
    iconClassName: 'hcl-leap-sample-signatureIcon',
    builtInProperties: [
        { id: 'title' }, { id: 'required' }, { id: 'seenInOverview', defaultValue: false }
    ],
    properties: [],
    datatype: {
        type: 'string',
        length: 10000
    },

    // initialize widget in the DOM
    instantiate: (context, domNode, initialProps, eventManager) => {
        let rootNode, titleNode, clearBtn, signaturePad;

        const widgetInstance = {
            /**
             * Called when properties change in the authoring environment
             */
            setProperty: (propName, propValue) => {
                switch (propName) {
                    case 'title':
                        titleNode.innerHTML = sanitizeHTML(propValue);
                        break;
                    default:
                        // ignore
                        break;
                }
            },

            setDisabled: (isDisabled) => {
                // always disable in the authoring environment
                const disabled = context.mode === 'design' || isDisabled;
                rootNode.classList.toggle('disabled', disabled);
                clearBtn.disabled = disabled;
                if (disabled) {
                    signaturePad.off();
                } else {
                    signaturePad.on();
                }
            },

            setValue: function (value) {
                signaturePad.fromData(JSON.parse(value));
            },

            getValue: function () {
                return JSON.stringify(signaturePad.toData());
            }
        };

        domNode.innerHTML = '' +
            '<div class="hcl-leap-sample-signature">' +
            '   <h3 class="hcl-leap-sample-title"><!-- title will go here --></h3>' +
            '   <canvas width="500" height="200"></canvas>' +
            '   <div class="hcl-leap-sample-footer">' +
            '      <div style="display: inline-block">Use your mouse to sign in the box above</div>' +
            '      <button class="hcl-leap-sample-button">Clear</button>' +
            '   </div>' +
            '</div>';

        rootNode = domNode.firstElementChild;
        titleNode = domNode.querySelector(':scope .hcl-leap-sample-title');
        clearBtn = domNode.querySelector(':scope .hcl-leap-sample-button');
        const canvas = domNode.querySelector(':scope canvas');
        signaturePad = new SignaturePad(canvas);
        signaturePad.addEventListener("endStroke", () => {
            eventManager.sendEvent('onChange');
        });
        clearBtn.addEventListener('click', () => {
            signaturePad.clear();
            eventManager.sendEvent('onChange');
        });

        if (context.mode === 'design') {
            widgetInstance.setDisabled(true);
        }

        // set initial prop values
        Object.keys(initialProps).forEach((propName) => {
            widgetInstance.setProperty(propName, initialProps[propName]);
        });

        return widgetInstance;
    }
}

nitro.registerWidget(signatureWidget);
