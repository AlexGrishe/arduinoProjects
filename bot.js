require("dotenv").config();
// const fetch = require("node-fetch");
const axios = require('axios');
const Binance =  require('binance-api-node');
const commandParts = require("./lib/commandParts");
const { randomAnimal } = require("./lib/randomAnimal");
const {Telegraf} = require("telegraf");
const emojiRegex = require('emoji-regex');
// Создать бота с полученным ключом
const MTProto = require('telegram-mtproto').MTProto;
const http = require('http');
const hostname = '127.0.0.1';
const port = 2700;
const serverLoc = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});
const phone = {
    num : '+380969690432',
    code: ''
}
const api = {
    layer          : 57,
    initConnection : 0x69796de9,
    api_id         : 0,
}
const bot = new Telegraf(""); //telegramBotApi

const server = {
    dev: true //We will connect to the test server.
}           //Any empty configurations fields can just not be specified

const client = MTProto({ server, api })

async function connect(){
    const { phone_code_hash } = await client('auth.sendCode', {
        phone_number  : phone.num,
        current_number: false,
        api_id        : 15008678,
        api_hash      : '' //apiHach
    })
    const { user } = await client('auth.signIn', {
        phone_number   : phone.num,
        phone_code_hash: phone_code_hash,
        phone_code     : phone.code
    })

    console.log('signed as ', user)
}
serverLoc.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
connect()

bot.use(commandParts);
// Обработчик начала диалога с ботом
bot.start((ctx) =>
    ctx.reply(
        `Приветствую, ${
            ctx.from.first_name ? ctx.from.first_name : "хороший человек"
        }! Набери /help и увидишь, что я могу.`
    )
);

// Обработчик команды /help
bot.help((ctx) => ctx.reply("Данный сервис в разработке..."));
const regex = emojiRegex();//Обрабатываем входное сообщение на запрещенные символы
function toEscapeMSg(str) {
    return str.replace(/_/gi, "\\_")
        .replace('', " ")
        .replace(str.length === 0, " ")
        .replace(/''/, 'null')
        .replace(NaN, 'null')
        .replace(0, 'null')
        .replace(/\null/, 'null')
        .replace(null, 'null')
        .replace(undefined, 'null')
        .replace(typeof false, 'null')
        .replace(false, 'null')
        .replace(/-/gi, "\\-")
        .replace("~", "\\~")
        .replace(/`/gi, "\\`")
        .replace(/\./g, "\\.");
}// Обработчик команды /whoami
bot.command("whoami", (ctx) => {
    const {id, username, first_name, last_name} = ctx.from;
    let escMsgF = toEscapeMSg(first_name);
    let escMsgL = last_name;
    escMsgL ? toEscapeMSg(last_name) : undefined;
    return ctx.replyWithMarkdown(`
    -
    id: ${id}
    userName: ${toEscapeMSg(username)}
    firstName: ${escMsgF}
    lastName: ${escMsgL}
    chatId: ${ctx.chat.id}
    `);
});

bot.command('audio', (ctx) => {
    return ctx.replyWithAudio({source: './Moment.mp3'})
})
bot.command("photo", async (ctx) => {
    const chatId = ctx.message.chat.id;
    // Получение аргументов
    const { args = "" } = ctx.state.command;
    // Возможно стоит проверить: верные аргументы пришли или нет
    const whatAnimal = args;
    // Пользователь, не скучай, я начал работу
    ctx.telegram.sendMessage(chatId, "Ищу фото ...");
    // Запрос урла картинки
    const url = await randomAnimal(whatAnimal);
    // Предусмотрительно защититься от null, который может внезапно прийти из апи (увы, да)
    if (!url) {
        return ctx.reply("Поиск фото не удался");
    }
    // А это что- gif, что ли пришёл, да?
    const extension = url.split(".").pop();
    if (extension.toLowerCase() === "gif") {
        // Если gif, значит оформить анимешку
        return telegram.sendAnimation(chatId, url);
    }
    return ctx.telegram.sendPhoto(chatId, url);
});
bot.command('sheri', (ctx) => {
    return `
    ${ctx.replyWithPhoto({source: './sheri.jpg'})}
    ${ctx.replyWithAudio({source: './spyat.mp3'})}
    `
});
bot.command("group", async (ctx) => {
    const catUrl = await randomAnimal("cat");
    return ctx.replyWithMediaGroup([
        { type: "photo", media: catUrl, caption: "Мяу" },
    ]);
});
bot.command("photo", async (ctx) => {
    const response = await axios.get('https://aws.random.cat/meow');
    const data = response.data;
    return ctx.reply(data.file);
});
//Подключаемся к бинансу
const binanceClient = Binance.default({
    apiKey: process.env.BINANCE_API_KEY,
    apiSec: process.env.BINANCE_API_SECRET,
})
const cryptoToken1 = 'DOT';//в вычеслении меняем первый токен
const cryptoToken2 = 'USDT';
//вычесление
let dotToken = 0;
binanceClient.avgPrice({ symbol: `${cryptoToken1}${cryptoToken2}` })
    .then((avgPrice) => {
        dotToken = avgPrice['price']
        console.log(dotToken)
    })
    .catch((error) =>
        console.log(`Error retrieving the price for ${cryptoToken1}${cryptoToken2}: ${error}`)
    );
bot.command('dot', async (ctx) => {
    return ctx.reply(dotToken)
})

const cryptoToken3 = 'XRP';
let xrpToken = 0;
binanceClient.avgPrice({ symbol: `${cryptoToken3}${cryptoToken2}` })
    .then((avgPrice) => {
        xrpToken = avgPrice['price']
        console.log(xrpToken)
    })
    .catch((error) =>
        console.log(`Error retrieving the price for ${cryptoToken1}${cryptoToken2}: ${error}`)
    );

bot.command('xrp', async (ctx) => {
    return ctx.reply(xrpToken)
})

bot.command('xrpdot', async (ctx) => {
    let xrpDotEx = 0;
    xrpDotEx += +dotToken / +xrpToken;
    return ctx.reply(`${xrpDotEx.toFixed(4)} DOT/XRP`)
})

bot.on("text", (ctx) => {
    return ctx.reply('Такой команды не существует. Пока что...');
});

// Запуск бота
bot.launch();
