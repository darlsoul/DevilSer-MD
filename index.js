const fs = require("fs");
const axios = require("axios");
const path = require("path");
const { MongoClient } = require('mongodb');
const MONGODB_URL = 'mongodb+srv://amruth:A1M2R3U4T5H@amruth.wnylfrc.mongodb.net/?retryWrites=true&w=majority&appName=Amruth';  // Ensure this is your MongoDB URI
const version = "1.0.0";
const express = require("express");
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const logger = require("pino");
const chatEvent = require("./lib/chatEvent");
let config = require("./config");
const app = express();
const port = process.env.PORT || 3000;
// Define the start function
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

// Function to get JSON data using sessionID
async function getDataBySessionID(sessionID) {
    const client = new MongoClient(MONGODB_URL);
    try {
        // Connect to MongoDB server
        await client.connect();

        // Specify the database and collection
        const db = client.db('session');  // Replace with your database name
        const collection = db.collection('create');  // Replace with your collection name

        // Query to find the document with the given SessionID
        const document = await collection.findOne({ SessionID: sessionID });

        if (document) {
            return document.creds;  // Return the JSON data
        } else {
            console.log(`No document found with SessionID: ${sessionID}`);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        return null;
    } finally {
        // Close the connection
        await client.close();
    }
}

// Function to create folder, retrieve data, and write to file
async function makeId(sessionId, folderPath, mongoDb) {
    try {
        // Create folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        // Retrieve JSON data using sessionId from MongoDB
        const jsonData = await getDataBySessionID(sessionId);

        if (jsonData) {
            // Convert JSON data to a string format
            const jsonString = JSON.stringify(jsonData, null, 2);

            // Write data to creds.json
            const filePath = path.join(folderPath, "creds.json");
            fs.writeFileSync(filePath, jsonString);
	    console.log(jsonString);
            console.log(`creds.json created successfully at ${filePath}\nData: ${jsonString}`);
        } else {
            console.log('No data found to write.');
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

// Example usage
const sessionId = config.SESSION_ID;  // Replace with your session ID
const folderPath = "./lib/session";
const mongoDb = MONGODB_URL;  // Use your MongoDB URI from config

makeId(sessionId, folderPath, mongoDb)
    .then(() => {
        console.log("makeId function executed successfully.");
        console.log("Session ID: " + sessionId);
    })
    .catch((error) => {
        console.error("Error occurred while executing makeId function:", error.message);
    });
    
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState("./lib/session");

  const client = makeWASocket({
    printQRInTerminal: false,
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
   console.log("DevilSer-MD By Amruth");
    client.sendMessage(config.SUDO+"@s.whatsapp.net", { 
        text: `Devil-𝙼𝙳 𝚂𝚝𝚊𝚛𝚝𝚎𝚍\n\n𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : ${version}\n𝙿𝚕𝚞𝚐𝚒𝚗𝚜 : not found\n𝙼𝚘𝚍𝚎 : not found\n𝙿𝚛𝚎𝚏𝚒𝚡 : ${config.HANDLERS}\n𝚂𝚞𝚍𝚘 : ${config.SUDO}`
    });
}});

  client.ev.on("creds.update", saveCreds);

  client.ev.on("messages.upsert", async (m) => {
    chatEvent(m, client);
  });
}
app.get("/", (req, res) => {
	res.send("Hello DevilSer-MD Started");
});
app.listen(port, () => console.log(`Devil-MD Server Listening On Port ${port}`));
start();
