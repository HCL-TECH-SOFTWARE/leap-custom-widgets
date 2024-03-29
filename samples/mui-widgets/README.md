# Material UI Widgets (Sample)

This project brings the following sample widgets to Leap:
- a 5-star Rating (https://mui.com/material-ui/react-rating/)
- a Switch (https://mui.com/material-ui/react-switch/)  

![screenshot](screenshot.png)
  
Note: This project was generated with [Vite](https://vitejs.dev/).

## Sample Objectives 
This sample demonstrates the following: 
- how to utilize Material UI React components in Leap

## Getting Started 
1. Install `git` and `npm` (consult the internet)
1. Open git bash console
1. Clone this repo. For example:  
 `git clone https://github.com/HCL-TECH-SOFTWARE/leap-custom-widgets.git`
1. `cd leap-custom-widgets/samples/mui-widgets`
1. `npm install`



## Scripts

In the project directory, you can run:

### `npm run dev`

Builds in the development mode.  
Example to incorporate into Leap:
```properties
ibm.nitro.NitroConfig.runtimeResources.1 = \
<link rel='stylesheet' type='text/css' media='screen' href='http://localhost:5173/src/index.css'> \n\
<script type='module' src='http://localhost:5173/src/main.js'></script>

```

Notes:  
- Leap pages will reload when you make changes to this project's source.  
- You might also see lint errors in the console.  
- **Known Issue:** Widget icons with not show up in development mode, because Vite does not allow for relative paths to the .svg files in dev mode.

### `npm run build`

Builds for production, to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`

As a follow-up to `npm run build`, this serves up built production assets at `localhost`.

Example to incorporate into Leap:
```properties
ibm.nitro.NitroConfig.runtimeResources.1 = \
<link rel='stylesheet' type='text/css' media='screen' href='http://localhost:4173/assets/index-4d2243fc.css'> \n\
<script type='module' src='http://localhost:4173/assets/index-fa54fabc.js'></script>
```

## From Vite
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
