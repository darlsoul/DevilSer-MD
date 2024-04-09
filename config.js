

const toBool = (x) => x === 'true';

module.exports = {
    SESSION_ID: process.env.SESSION_ID || 'Devilser~AHs',
    HANDLERS: process.env.HANDLERS || '.',//[.]
    BOT_NAME: process.env.BOT_NAME || 'DevilSer_Md',
    OWNER_NAME: process.env.OWNER_NAME || '🙃',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '916282378078',
    SUDO: process.env.SUDO || '916282378078',
    MODE: (process.env.MODE || 'public').trim(),
    STICKER_DATA: process.env.STICKER_DATA || '🎯inrl-𝙼𝙳;loki-x☘️',
};
