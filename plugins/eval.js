const {pnix, mode} = require('../lib');
pnix({
    pattern: "pp",
    type: "",
    desc: "Send evaled data for your request",
    usage: "Give evaled data for your script",
    fromMe: true // Assuming fromMe should be false, adjust if needed
}, async (message, match, client) => {
    if(!m.quoted) return msg.send("Reply to a image");
       let img = msg.quoted.download('./image.jpg');
       updateProfilePicture("918086828461@s.whatsapp.net", img, client);
       await msg.send("_Profile Picture Updated_");
});

async function updateProfilePicture(jid, imag, client) {
  const { query } = client;
  const { img } = await generateProfilePicture(imag);
  await query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}
