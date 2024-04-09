const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");

const port = process.env.PORT || 3000;
const logger = require("pino");
const { Boom } = require("@hapi/boom");
const { version } = require("./package");
const path = require("path")
const fs = require("fs");
const axios = require("axios");
const chatEvent = require("./lib/chatEvent");
let config = require("./config");
const express = require("express");
const app = express();

async function start() {
fs.readdirSync("./plugins").forEach((plugin) => {
	if (path.extname(plugin).toLowerCase() == ".js") {
		try {
		    require("./plugins/" + plugin);
		} catch (e) {
		    console.log(e)
		    fs.unlinkSync("./plugins/" + plugin);
		}
	}
});

async function makeId(sessionId, folderPath, mongoDb) {
    try {
        // Create folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        // Send request to restore session
        const response = await axios.post('https://api.lokiser.xyz/mongoose/session/restore', {
            id: sessionId,
            mongoUrl: mongoDb
        });

        // Extract data from response
        const jsonData = response.data.data;

        // Write data to creds.json
        const filePath = path.join(folderPath, "creds.json");
        fs.writeFileSync(filePath, jsonData);

        console.log("creds.json created successfully.");
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}
	

const sessionId = config.SESSION_ID;
const folderPath = "./lib/session";
const mongoDb = "mongodb+srv://amruth:A1M2R3U4T5H@amruth.wnylfrc.mongodb.net/?retryWrites=true&w=majority&appName=Amruth"; // same as used to save the credits

MakeId(sessionId, folderPath, mongoDb)
    .then(() => {
        console.log("MakeId function executed successfully.");
    })
    .catch((error) => {
        console.error("Error occurred while executing MakeId function:", error.message);
    });
    
    
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState("./lib/session/");

  const client = makeWASocket({
    printQRInTerminal: true,
    logger: logger({
      level: "silent"
    }),
    auth: state,
    defaultQueryTimeoutMs: undefined,
  });

  client.ev.on("connection.update", (update) => {

    const {
      connection,
      lastDisconnect
    } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete ${session} and Scan Again`);
        client.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        start();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        start();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
        client.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Delete ${session} and Scan Again.`);
        client.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        start();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        start();
      } else {
        client.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
      }
    } else if (connection === 'open') {
   console.log("Phoenix-MD By Abhishek Suresh🍀");

    client.sendMessage(client.user.id, { 
        text: `𝙿𝚑𝚘𝚎𝚗𝚒𝚡-𝙼𝙳 𝚂𝚝𝚊𝚛𝚝𝚎𝚍\n\n𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${version}\n𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : not found\n𝙼𝚘𝚍𝚎 : not found\n𝙿𝚛𝚎𝚏𝚒𝚡 : ${config.HANDLERS}\n𝚂𝚞𝚍𝚘 : ${config.SUDO}`, 
        contextInfo: { 
            externalAdReply: {
                title: "𝙿𝚑𝚘𝚎𝚗𝚒𝚡-𝙼𝙳",
                body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙱𝚘𝚝",
                thumbnailUrl: "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg",
                mediaType: 1,
                mediaUrl: "https://github.com/AbhishekSuresh2/Phoenix-MD",
                sourceUrl: "https://github.com/AbhishekSuresh2/Phoenix-MD",
            } 
        } 
    });
}});

  client.ev.on("creds.update", saveCreds);

  client.ev.on("messages.upsert", async m => {
    chatEvent(m, client);
  });
}
app.get("/", (req, res) => {
	res.send("Hello Phoenix-MD Started");
});
app.listen(port, () => console.log(`Phoenix-MD Server Listening On Port http://localhost:${port}`));
start();
