const { pnix, mode} = require("../lib");

pnix({
    pattern: "hi",
    type: "main",
    desc: "Bot response.",
    fromMe: mode
}, async(msg, match) => {
        await msg.reply(`Hello`);
})
