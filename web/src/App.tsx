import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Spinner from "./Spinner";
import DisconnectedErrorMessage from "./DisconnectedErrorMessage";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Status = "connecting" | "connected" | "disconnected";

interface Record {
  usdToBrlRate: number;
  bitcoinValueInBrl: number;
  microsoftValueInBrl: number;
  appleValueInBrl: number;
}

type Financials = { [time: string]: Record };

const socket = io(`http://localhost:8000`);

function getFormattedTime(date: Date): string {
  const currentDate = new Date();
  return `${currentDate.getHours()}:${currentDate.getMinutes()}`;
}

function App() {
  const [financials, setFinancials] = useState<Financials>({});
  const [status, setStatus] = useState<Status>("connecting");

  const usdToBrlRates = useMemo(
    () =>
      Object.keys(financials).map((key) => ({
        time: key,
        rate: financials[key].usdToBrlRate,
      })),
    [financials]
  );

  const bitcoinValuesInBrl = useMemo(
    () =>
      Object.keys(financials).map((key) => ({
        time: key,
        value: financials[key].bitcoinValueInBrl,
      })),
    [financials]
  );

  const microsoftValuesInBrl = useMemo(
    () =>
      Object.keys(financials).map((key) => ({
        time: key,
        value: financials[key].microsoftValueInBrl,
      })),
    [financials]
  );
  const appleValuesInBrl = useMemo(
    () =>
      Object.keys(financials).map((key) => ({
        time: key,
        value: financials[key].appleValueInBrl,
      })),
    [financials]
  );

  function handleNewFinancialInformation(record: Record) {
    console.log("new financial information");

    setFinancials((records: Financials) => {
      const newRecords = { ...records };
      newRecords[getFormattedTime(new Date())] = record;
      return newRecords;
    });
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      setStatus("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      setStatus("disconnected");
    });

    socket.on("newFinancialInformation", handleNewFinancialInformation);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newFinancialInformation");
    };
  }, [socket]);

  if (status === "connecting") {
    return <Spinner />;
  }

  if (status === "disconnected") {
    return <DisconnectedErrorMessage />;
  }

  console.log(financials, usdToBrlRates);

  return (
    <div className="App">
      <h1>Realtime Financial Information</h1>
      <div className="Charts-Container">
        <div>
          <h2>USD to BRL</h2>
          <LineChart width={500} height={300} data={usdToBrlRates}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="rate" stroke="#8884d8" />
          </LineChart>
        </div>
        <div>
          <h2>Bitcoin in BRL</h2>
          <LineChart width={500} height={300} data={bitcoinValuesInBrl}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
        <div>
          <h2>Microsoft in BRL</h2>
          <LineChart width={500} height={300} data={microsoftValuesInBrl}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
        <div>
          <h2>Apple in BRL</h2>
          <LineChart width={500} height={300} data={appleValuesInBrl}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default App;
