("use strict");
require("dotenv").config();
const Glue = require("@hapi/glue");
const Routes = require("./config/routes");
const Manifest = require("./config/manifest");
const AppConfig = require("./config/app");
const Logger = require("./utils/logging");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package.json");
const { startSchedule } = require("./APIs/Product/cronjob");
const Queue = require("hapi-queue");
(async function () {
  try {
    const server = await Glue.compose(Manifest, { relativeTo: __dirname });
    const io = require("socket.io")(server.listener, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    const db = require("./models/index");
    await db.sequelize.sync({ force: false, alter: false });

    const swaggerOptions = {
      info: {
        title: "API Documentation",
        version: Pack.version,
      },
    };
    const queueOptions = {
      name: "uploadQueue",
      concurrency: 1,
    };
    await server.register([
      Vision,
      Inert,
      {
        plugin: HapiSwagger,
        Queue,
        options: swaggerOptions,
        queueOptions,
      },
    ]);

    await server.start().then(() => {
      Logger.info(`Server running at: ${server.info.uri}`);
    });
    io.on("connection", function (params) {});
    exports.sockets = io.sockets;
    server.auth.strategy("jwt", "jwt", {
      keys: AppConfig.jwt.secret,
      verify: {
        aud: "urn:audience:tdsfsdfsdfsdfdest",
        iss: "urn:issuer:tesdfsdfsdfst",
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 86400,
        timeSkewSec: 15,
      },

      validate: (artifacts, _, __) => {
        return {
          isValid: true,
          credentials: { user: artifacts.decoded.payload.user },
        };
      },
    });

    //start config websocket

    // const wsServer = new webSocketServer({
    //   httpServer: server,
    // });
    // const clients = {};
    // //this code generates unique userid for everyuser
    // const getUniqueID = () => {
    //   const s4 = () =>
    //     Math.floor((1 + Math.random()) * 0x10000)
    //       .toString(16)
    //       .substring(1);
    //   return s4() + s4() + "-" + s4();
    // };
    // wsServer.on('request',function(request){
    //     var userID  =  getUniqueID()
    //     // console.log((new Date()) + ' Recieved a new connection from origin '+request.origin + '.');
    //     //You can rewrite this part of the code to accept only the requests from allowed origin
    //     const connection = request.accept(null,request.origin);
    //     clients[userID] = connection;
    //     // console.log('connected: '+userID + ' in ' + Object.getOwnPropertyNames(clients));
    //     connection.on('message',function(message) {
    //         if (message.type=="utf8") {
    //             console.log('Received Message> ', message.utf8Data);

    //             //broadcasting message to all connected clients
    //             for (key in clients) {
    //                 clients[key].sendUTF(message.utf8Data);
    //                 // console.log('sent message to: ',clients[key]);
    //             }
    //         }
    //     })
    // })
    //end config websocket

    server.route(Routes);
    startSchedule();
  } catch (error) {
    Logger.error(`${__filename} ${error}`);
  }
})();
