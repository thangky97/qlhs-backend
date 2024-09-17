"use strict";
require("dotenv").config();
const AppConfig = require("../config/app");
// const CopyPlugin = require('copy-webpack-plugin');

// let swaggerUIPlugin = new CopyPlugin({
//     patterns: [
//         '../node_modules/swagger-ui-dist/swagger-ui.css',
//         '../node_modules/swagger-ui-dist/swagger-ui-bundle.js',
//         '../node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
//         '../node_modules/swagger-ui-dist/favicon-16x16.png',
//         '../node_modules/swagger-ui-dist/favicon-32x32.png'
//     ]
// });

// swaggerUIPlugin = {
//     ...swaggerUIPlugin,
//     register: (_, h) => { h.continue; },
//     name: 'swagger-dist'
// }

const manifest = {
  server: {
    routes: {
      cors: true,
    },
    port: process.env.PORT || 3000,
  },
  register: {
    plugins: [
      {
        plugin: "@hapi/jwt",
        options: {
          expiresIn: AppConfig.jwt.expiresIn,
        },
      },
      // swaggerUIPlugin
      // new CopyPlugin({
      //     patterns: [
      //         {
      //             // Copy static asset files so that they can be served from output directory as swagger-ui-dist does not work
      //             // with webpack.
      //             from: path.resolve(__dirname, 'node_modules/swagger-ui-dist/'),
      //             to: 'node_modules/swagger-ui-dist'
      //         }
      //     ],
      // })
    ],
  },
};

module.exports = manifest;
