# Vtube Firebot Custom Script in Typescript

### Setup
1. Fork the repo
2. `npm install`

### Building
Dev:
1. `npm run build:dev`
- Automatically copies the compiled .js to Firebot's scripts folder.

### Note
- Keep the script definition object (that contains the `run`, `getScriptManifest`, and `getDefaultParameters` funcs) in the `index.ts` file as it's important those function names don't get minimized.
- Edit the `"scriptOutputName"` property in `package.json` to change the filename of the outputted script.
