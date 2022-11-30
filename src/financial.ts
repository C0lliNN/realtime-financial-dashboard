const fetch = require("node-fetch");

export interface FinancialInformation {
  usdToBrlRate: number;
  bitcoinValueInBrl: number;
  microsoftValueInBrl: number;
  appleValueInBrl: number;
}

export async function getLatestFinancialInformation(): Promise<FinancialInformation> {
  const responses = await Promise.all([
    getUsdToBrlRate(),
    getBitcoinValue(),
    getMicrosoftValue(),
    getAppleValue(),
  ]);

  const usdToBrlRate = responses[0];
  const bitcoinValueInBrl = responses[1] * usdToBrlRate;
  const microsoftValueInBrl = responses[2] * usdToBrlRate;
  const appleValueInBrl = responses[3] * usdToBrlRate;

  return {
    usdToBrlRate,
    bitcoinValueInBrl,
    microsoftValueInBrl,
    appleValueInBrl,
  };
}

async function getUsdToBrlRate(): Promise<number> {
  const url =
    "https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=usd&to=BRL&amount=1";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cdd4750d8amshc864cb9fa7b9e5bp11ffa2jsn3bc2042f9b45",
      "X-RapidAPI-Host": "currency-converter5.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data: any = await response.json();

    if (!response.ok) {
      throw data
    }

    return parseFloat(data.rates.BRL.rate);
  } catch (e) {
    return Promise.reject(e);
  }
}

async function getBitcoinValue(): Promise<number> {
  const url =
    "https://alpha-vantage.p.rapidapi.com/query?from_currency=BTC&function=CURRENCY_EXCHANGE_RATE&to_currency=USD";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cdd4750d8amshc864cb9fa7b9e5bp11ffa2jsn3bc2042f9b45",
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data: any = await response.json();

    if (!response.ok) {
      throw data
    }

    return parseFloat(
      data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
    );
  } catch (e) {
    return Promise.reject(e);
  }
}

async function getMicrosoftValue(): Promise<number> {
  const url =
    "https://alpha-vantage.p.rapidapi.com/query?interval=1min&function=TIME_SERIES_INTRADAY&symbol=MSFT&datatype=json&output_size=compact";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cdd4750d8amshc864cb9fa7b9e5bp11ffa2jsn3bc2042f9b45",
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw data
    }

    const values = data["Time Series (1min)"];
    const lastData = Object.keys(values).pop();

    return parseFloat(values[lastData as string]["4. close"]);
  } catch (e) {
    return Promise.reject(e);
  }
}

async function getAppleValue(): Promise<number> {
  const url =
    "https://alpha-vantage.p.rapidapi.com/query?interval=1min&function=TIME_SERIES_INTRADAY&symbol=AAPL&datatype=json&output_size=compact";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cdd4750d8amshc864cb9fa7b9e5bp11ffa2jsn3bc2042f9b45",
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw data
    }

    const values = data["Time Series (1min)"];
    const lastData = Object.keys(values).pop();

    return parseFloat(values[lastData as string]["4. close"]);
  } catch (e) {
    return Promise.reject(e);
  }
}
