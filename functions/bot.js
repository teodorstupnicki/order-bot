/* eslint-disable linebreak-style */
const express = require("express");
const app = express();
const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");
const botUrl = TELEGRAM_TOKEN;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const {SessionsClient} = require("@google-cloud/dialogflow");


exports.dialogflowGateway = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // const {queryInput, sessionId} = request.body;
    const mess = request.body.message.text;
    const chat = request.body.message.chat.id;
    // const sessionClient = new SessionsClient({credentials: serviceAccount});
    // const session = sessionClient
    //     .projectAgentSessionPath("blockchain-bot", "foo");

    await admin
        .firestore().collection("updates")
        .add({messageText: mess, chat_id: chat});
    // const str = "I want to update my profile";
    // const query = {
    //   queryInput: {
    //     text: {
    //       text: mess,
    //       languageCode: "en-US",
    //     },
    //   },
    // };
    // // const responses =
    // await sessionClient.detectIntent({session, query});

    // const result = responses[0].queryResult.queryText;

    const responseForTelegram = {
      chat_id: chat,
      text: mess,
    };
    app.post(botUrl, function(req, res) {
      res.send(responseForTelegram);
    });

    response.sendStatus(200);
  });
});
