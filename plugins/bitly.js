const { pnix, mode} = require("../lib");

pnix({
    pattern: "alive",
    type: "main",
    desc: "Shorten links",
    fromMe: mode
}, async(m, match) => {
  m.reply("Yes, I'm still alive");
});
