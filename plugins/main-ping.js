const {
       calculatePing,
       Module,
       mode
      } = require("../lib");

Module({
    pattern: "ping",
    type: "main",
    desc: "Bot response.",
    fromMe: mode
}, async(msg, match) => {
        await msg.reply(`*📡Pong!* ${calculatePing(msg.messageTimestamp, Date.now())} Ms`);
})
