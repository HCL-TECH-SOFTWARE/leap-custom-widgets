# Material UI Widgets (Sample)

This project brings the following sample widgets to Leap:
- a 5-star Rating (https://mui.com/material-ui/react-rating/)
- a Switch (https://mui.com/material-ui/react-switch/)  
  
Note: This project was generated with [create-react-app](https://github.com/facebook/create-react-app), including portions of this README.

## Sample Objectives 
This sample demonstrates the following: 
- how to utilize Material UI React components in Leap

## Getting Started 
1. Install `git` and `npm` (consult the internet)
1. Open git bash console
1. Clone this repo. For example:  
 `git clone https://github.com/HCL-TECH-SOFTWARE/leap-custom-widgets.git`
1. `cd leap-custom-widgets/samples/mui-widgets`
1.  `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Builds in the development mode.\
Example to incorporate into Leap:
```properties
ibm.nitro.NitroConfig.runtimeResources.1 = \
<script type='text/javascript' src='http://localhost:3000/static/js/bundle.js'></script>

```

Leap pages will reload when you make changes to this project's source.\
You may also see any lint errors in the console.

### `npm run build`

Builds for production, to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Example to incorporate into Leap:
```properties
ibm.nitro.NitroConfig.runtimeResources.1 = \
<link rel='stylesheet' type='text/css' media='screen' href='http://127.0.0.1:5500/build/static/css/main.2cfec692.css'> \n\
<script nonce='#!#cspNonce!#!' type='text/javascript' src='http://127.0.0.1:5500/build/static/js/main.eb1c37e3.js'></script>
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
