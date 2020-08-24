const uWS = require("uWebSockets.js");
const port = 8082;
// const config = require("./config/database");
// const mongoose = require("mongoose");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf8");

// mongoose.connect(config.database, {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.Promise = global.Promise;

function getUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
}

const app = uWS
  .App({})
  .ws("/*", {
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60000,
    open: (ws, req) => {
      ws.id = getUniqueID();
      console.log(ws.id, " connected");
    },
    message: (ws, message, isBinary) => {
      let json = JSON.parse(decoder.write(Buffer.from(message)));
      console.log(json);
      switch (json.action) {
        case "chat-sub": {
          console.log("subbed", json.room);
          ws.subscribe(json.room);
          break;
        }
        case "chat-unsub": {
          ws.unsubscribe(json.room);
          break;
        }
        case "chat-pub": {
          json.id = getUniqueID();
          json.date = new Date();
          ws.publish(json.room, JSON.stringify(json));
        }
      }
    },
    drain: (ws) => {
      console.log("WebSocket backpressure: " + ws.getBufferedAmount());
    },
    close: (ws, code, message) => {
      console.log("CHATTEN AYRILDI");
    },
  })
  .any("/*", (res, req) => {
    res.end("Nothing to see here!");
  })
  .listen(port, (token) => {
    if (token) {
      console.log("Listening to port " + port);
    } else {
      console.log("Failed to listen to port " + port);
    }
  });
