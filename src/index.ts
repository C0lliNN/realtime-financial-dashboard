import express from "express";
import http from "http";
import { Server } from "socket.io";
import { getLatestFinancialInformation } from "./financial";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

setTimeout(() => {
  getLatestFinancialInformation()
    .then((financialInfo) => {
      console.log(
        "New financial information available: ",
        JSON.stringify(financialInfo)
      );
      io.send("newFinancialInformation", financialInfo);
    })
    .catch((err) =>
      console.error("Error when fetching financial information:", err)
    );
}, 1000);

app.get("/health-check", (req, res) => {
  res.send({ status: "OK" });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
