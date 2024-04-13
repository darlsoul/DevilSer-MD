const { Bitly, isUrl } = require ("../lib/functions");
const { pnix, mode} = require("../lib");

pnix({
    pattern: "bitly",
    type: "main",
    desc: "Shorten links",
    fromMe: mode
}, async(m, match) => {
  if(!match || !isUrl(match)) m.reply("_Provide a link to make it shorten_");
        const url = await Bitly(match);
        await m.reply("Shortened Url :`"+url+"`");
    }
)
