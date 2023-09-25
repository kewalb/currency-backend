import Express from 'express';
import dotenv  from "dotenv";
import {priceExchange, fetchHistoricalData, fetchCurrencyList} from './price/helper.js'; 
import cors from 'cors';

// create an object of Express.
const app = Express();
app.use(cors())

//Configuring environment variables.
dotenv.config();

// middlewares.
app.use(Express.json());

const PORT = process.env.PORT || 3000;
// Endpoints for front-end application.

// Test Endpoint.
app.get("/", (request, response) => {
    response.status(200).json({"message": "Successfully Created"})
});

app.get('/currency', async(request, response) => {
    let data = await fetchCurrencyList();
    console.log(data);
    response.send(data);
})

app.get("/convert", async(request, response) => {
    let currency1 = request.query.currency1;
    let currency2 = request.query.currency2;
    let amount = request.query.value;
    console.log(currency1, currency2, amount)
    let result = await priceExchange(currency1, currency2, amount);
    response.send(result);
})

app.get("/historical-data", async(request, response) => {
    let currency1 = request.query.currency1;
    let currency2 = request.query.currency2;
    console.log(currency1, currency2)
    let result = await fetchHistoricalData(currency1, currency2);
    console.log("historic", result);
    response.send(result)
})




app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });