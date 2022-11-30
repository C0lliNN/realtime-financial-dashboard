import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import {
  FinancialInformation,
  getLatestFinancialInformation,
} from "./financial";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let latestFinancialInformation: FinancialInformation | null = null;

setInterval(() => {
  getLatestFinancialInformation()
    .then((financialInfo) => {
      console.log("New financial information available: ", financialInfo);

      latestFinancialInformation = financialInfo;

      io.emit("newFinancialInformation", financialInfo);
    })
    .catch((err) =>
      console.error("Error when fetching financial information:", err)
    );
}, 1000 * 60);

app.get("/health-check", (req, res) => {
  res.send({ status: "OK" });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  
  if (latestFinancialInformation) {
    socket.emit("newFinancialInformation", latestFinancialInformation);
  }

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});
