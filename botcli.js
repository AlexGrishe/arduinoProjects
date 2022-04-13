const {Api} = require("telegram/tl");
const {TelegramClient} = require("telegram");
const {StringSession} = require("telegram/sessions");
const input = require("input");
const http = require("http");
const {signInUserWithQrCode} = require("telegram/client/auth"); // npm i input
const hostname = '127.0.0.1';
const port = 3000;
const serverLoc = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Alex');
});
const phone = ''; //380...
const apiId = 0;
const apiHash = "";
const stringSession = new StringSession(""); // fill this later with the value from session.save()

let client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
});
let clientEnter;
startLog = (async () => {
    console.log("Loading interactive example...");
    clientEnter = await client.start({
        phoneNumber: phone,
        // phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });




    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
    await client.sendMessage("me", {message: "Hello!"});
    await client.sendMessage('https://t.me/test1arOb_bot', {message: "/sheri"});

    // for await (const message of client.iterMessages('https://t.me/test1arOb_bot',{reverse: true})) {
    //     console.log(message.id, message.text)
    // }


    for await (const user of client.iterParticipants('https://t.me/KIEV_IT', {limit: 99})){
        console.log("User id",user.firstName, user.id);
    }

    let dialogs = await client.getDialogs({});
    let firstD = dialogs[0];
    console.log(firstD.title);
    // const result2 = await client.invoke(new Api.client.iterParticipants('https://t.me/cryptographofficial',{
    //     limit: 99
    // }));
    // console.log("does this username exist?" + result2);


    // const result = await client.invoke(new Api.account.CheckUsername({
    //     username: 'AlexGrishe'
    // }));
    // console.log("does this username exist?" + result);

    // let photo = await client.downloadProfilePhoto('https://t.me/o_a_julia');
    // await client.sendFile('963621431', {file: photo, caption: 'hi boy'})
});
startLog();

serverLoc.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

