const { pnix, commands, mode} = require("../lib");
function listCommands() {
  return commands.map(cmd => {
    return `
    ================================
    || Name: ${cmd.pattern},
    || Admin Command : ${cmd.fromMe},
    || Description: ${cmd.desc},
    || Only Group: ${cmd.onlyGroup}
    `;
  }).join('\n');
}

pnix({
    pattern: "runtime",
    type: "main",
    desc: "Check Bot Runtime",
    fromMe: mode
}, async(msg) => {
        await msg.reply(`_*Available Commands*_\n\n${listCommands()}`);
    }
)
