const { dependencies } = require("./package.json");
module.exports = {
name: "mainpage",
filename: "remoteEntry.js",
remotes: {},
exposes: {
    "/HomePage": "./src/App",
},
}
