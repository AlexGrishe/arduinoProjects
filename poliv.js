let five = require('johnny-five');
let board = new five.Board();

board.on('ready', function() {
let relay = new five.Relay({
    pin: 10,
    type: "NO"
})
    setInterval(function () {
        relay.open()
    }, 500)
});

// let led = new five.Led(13); // pin 13
// let sensor = new five.Sensor({
//     pin: "A0",
//     freq: 2500
// });
// sensor.on("change", function() {
//     let v = this.value;
//     if (v > 590) {
//         console.log('Поливаем');
//     } else {
//         console.log('Достаточно')
//     }
// });
// led.blink(1000); // 500ms interval
