import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const KEY = process.env.API_KEY;

console.log("api_KEY", KEY);

export let fetchCurrencyList = async () => {
  let data = {};
  const options = {
    method: "GET",
    url: "https://api.apilayer.com/exchangerates_data/symbols",
    headers: { accept: "application/json", apikey: KEY },
  };

  try {
    const response = await axios.request(options);
    data = { status: "Success", data: Object.keys(response.data.symbols) };
  } catch (error) {
    console.log(error.message);
    data = { status: "Failed", data: [] };
  }
  return data;
};

export let priceExchange = async (currency1, currency2, value) => {
  let data = {};
  const options = {
    method: "GET",
    url: "https://api.apilayer.com/exchangerates_data/convert",
    params: {
      from: currency1,
      to: currency2,
      amount: value,
    },
    headers: { accept: "application/json", apikey: KEY },
  };

  try {
    const response = await axios.request(options);

    data = { status: "Success", data: response.data };
  } catch (error) {
    console.log(error.message);
    data = { status: "Failed", data: [] };
  }
  return data;
};

export let fetchHistoricalData = async (currency1, currency2) => {
  let data = {};
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  const todayFormatted = formatDate(today);
  const oneYearAgoFormatted = formatDate(oneYearAgo);
  const options = {
    method: "GET",
    url: `https://api.apilayer.com/exchangerates_data/timeseries`,
    params: {
      start_date: oneYearAgoFormatted,
      end_date: todayFormatted,
      base: currency1,
      symbols: currency2,
    },
    headers: { accept: "application/json", apikey: KEY },
  };

  try {
    const response = await axios.request(options);
    console.log(response)
    data = { status: "Success", data: transformHistoricData(response.data.rates) };
  } catch (error) {
    console.log(error.message);
    data = { status: "Failed", data: [] };
  }
  return data;
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function transformHistoricData(data){      
      const datesArray = [];
      const pricesArray = [];
      
      for (const date in data) {
        if (data.hasOwnProperty(date)) {
          const priceData = data[date];
          const currency = Object.keys(priceData)[0];
          const price = priceData[currency];
      
          datesArray.push(date);
          pricesArray.push(price);
        }
      }
      let final = {prices: pricesArray, dates: datesArray}
      return final;
}