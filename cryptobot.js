const Binance =  require('binance-api-node');
const dotenv = require('dotenv')
const {formatMoney} = require('./data/formatMoney');
dotenv.config();

const binanceClient = Binance.default({
    apiKey: process.env.BINANCE_API_KEY,
    apiSec: process.env.BINANCE_API_SECRET,
})

const cryptoToken1 = 'DOT';
const cryptoToken2 = 'USDT';

binanceClient.avgPrice({ symbol: `${cryptoToken1}${cryptoToken2}` })
    .then((avgPrice) => {
        console.log(avgPrice['price'])
    })
    .catch((error) =>
        console.log(`Error retrieving the price for ${cryptoToken1}${cryptoToken2}: ${error}`)
    );

//
// async function futBal() {
//     console.info( await binanceClient.futuresAccountBalance());
// }
// futBal();
