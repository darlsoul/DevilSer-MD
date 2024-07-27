const { pnix, runtime, mode} = require("../lib");

Module({
    pattern: "runtime",
    type: "main",
    desc: "Check Bot Runtime",
    fromMe: mode
}, async(msg) => {
        const time = await runtime()
        await msg.reply(`_*Runtime ${time}*_`);
    }
)
