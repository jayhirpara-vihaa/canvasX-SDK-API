import express, { RequestHandler, Response } from "express";
import http from "http";
import { PORT } from "./env.var";
import routes from "../routes/index.route";
import { bodyDecipher } from "../middlewares/req-res-encoder";
import dbConnection from "./dbContext";
var cors = require('cors')

export default ({ app }: { app: express.Application }) => {
  app.use(cors())
  app.use(express.json());
  app.use(async (req, res, next) => {
    app.use("/api/v1", [bodyDecipher], routes());
    next();
  });
  startServer(app);
  dbConnection;
};

const startServer = (app: express.Application) => {
  let port = PORT.toString();
  app.set("port", port);

  let server = http.createServer(app);
  server.listen(port);

  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe  ${addr}` : `port-${port}`;
  console.log(`🛡️   Server listening on ${bind} 🛡️ `);
};

