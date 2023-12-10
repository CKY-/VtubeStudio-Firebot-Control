# Vtube Firebot Custom Script

## How to use
1. Install [Firebot](https://firebot.app)
2. Install [VTube Studio](https://denchisoft.com/) 
3. Download the latest **VtubeScript.js** file from [Releases](https://github.com/cky-/Vtube/releases)
4. Add the **VtubeScript.js** as a startup script in Firebot (Settings > Advanced > Startup Scripts)
5. In the settings change your ports and ipAddress to match VTS settings
6. Create a text file (.txt) with any name you'd like and save it either in the scripts folder (which would be my recommendation), or somewhere on your hard drive that you'll easily be able to find. This will be used as the Token File.
7. Restart Firebot and enjoy!

## Developers
### Setup
1. Clone or fork repo
2. `npm install`

### Building
1. `npm run build:dev`
2. Copy the `.js` file in `/dist` to Firebot's `scripts` folder
 
