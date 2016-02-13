var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * VoiceGame is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 */
var VoiceGame = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
VoiceGame.prototype = Object.create(AlexaSkill.prototype);
VoiceGame.prototype.constructor = VoiceGame;

VoiceGame.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("VoiceGame onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

VoiceGame.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("VoiceGame onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

VoiceGame.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("VoiceGame onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
VoiceGame.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("VoiceGame onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    response.tell('Game Lanuch.');
};


VoiceGame.prototype.intentHandlers = {
    "GameStartIntent": function (intent, session, response) {
        response.tell('Game Start. What do you like?');
    },

    "DoSth": function (intent, session, response) {
        var speechText = "I don't know.";

        if(intent.slots.choice && intent.slots.choice.value) {
          speechText = 'You like ' + intent.slots.choice.value;
          // switch (intent.slots.choice.value) {
          //   case 'apple' : speechText = 'You like apples.';break;
          //   case 'orange': speechText = 'You like oranges.';break;
          //   default: speechText = 'What are you saying?';
          // }
        }

        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        // For the repromptText, play the speechOutput again
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Stop Game";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Cancel Game";
        response.tell(speechOutput);
    }
};

// /**
//  * Selects a joke randomly and starts it off by saying "Knock knock".
//  */
// function handleTellMeAJokeIntent(session, response) {
//     var speechText = "";

//     //Reprompt speech will be triggered if the user doesn't respond.
//     var repromptText = "You can ask, who's there";

//     //Check if session variables are already initialized.
//     if (session.attributes.stage) {

//         //Ensure the dialogue is on the correct stage.
//         if (session.attributes.stage === 0) {
//             //The joke is already initialized, this function has no more work.
//             speechText = "knock knock!";
//         } else {
//             //The user attempted to jump to the intent of another stage.
//             session.attributes.stage = 0;
//             speechText = "That's not how knock knock jokes work! "
//                 + "knock knock";
//         }
//     } else {
//         //Select a random joke and store it in the session variables.
//         var jokeID = Math.floor(Math.random() * JOKE_LIST.length);

//         //The stage variable tracks the phase of the dialogue.
//         //When this function completes, it will be on stage 1.
//         session.attributes.stage = 1;
//         session.attributes.setup = JOKE_LIST[jokeID].setup;
//         session.attributes.speechPunchline = JOKE_LIST[jokeID].speechPunchline;
//         session.attributes.cardPunchline = JOKE_LIST[jokeID].cardPunchline;

//         speechText = "Knock knock!";
//     }

//     var speechOutput = {
//         speech: speechText,
//         type: AlexaSkill.speechOutputType.PLAIN_TEXT
//     };
//     var repromptOutput = {
//         speech: repromptText,
//         type: AlexaSkill.speechOutputType.PLAIN_TEXT
//     };
//     response.askWithCard(speechOutput, repromptOutput, "Wise Guy", speechText);
// }

// /**
//  * Responds to the user saying "Who's there".
//  */
// function handleGameStartIntent(session, response) {
//     var speechText = "";
//     var repromptText = "";

//     if (session.attributes.stage) {
//         if (session.attributes.stage === 1) {
//             //Retrieve the joke's setup text.
//             speechText = session.attributes.setup;

//             //Advance the stage of the dialogue.
//             session.attributes.stage = 2;

//             repromptText = "You can ask, " + speechText + " who?";
//         } else {
//             session.attributes.stage = 1;
//             speechText = "That's not how knock knock jokes work! <break time=\"0.3s\" /> "
//                 + "knock knock";

//             repromptText = "You can ask, who's there."
//         }
//     } else {

//         //If the session attributes are not found, the joke must restart.
//         speechText = "Sorry, I couldn't correctly retrieve the joke. "
//             + "You can say, tell me a joke";

//         repromptText = "You can say, tell me a joke";
//     }

//     var speechOutput = {
//         speech: '<speak>' + speechText + '</speak>',
//         type: AlexaSkill.speechOutputType.SSML
//     };
//     var repromptOutput = {
//         speech: '<speak>' + repromptText + '</speak>',
//         type: AlexaSkill.speechOutputType.SSML
//     };
//     response.ask(speechOutput, repromptOutput);
// }

// /**
//  * Delivers the punchline of the joke after the user responds to the setup.
//  */
// function handleSetupNameWhoIntent(session, response) {
//     var speechText = "",
//         repromptText = "",
//         speechOutput,
//         repromptOutput,
//         cardOutput;

//     if (session.attributes.stage) {
//         if (session.attributes.stage === 2) {
//             speechText = session.attributes.speechPunchline;
//             cardOutput = session.attributes.cardPunchline;
//             speechOutput = {
//                 speech: '<speak>' + speechText + '</speak>',
//                 type: AlexaSkill.speechOutputType.SSML
//             };
//             //If the joke completes successfully, this function uses a "tell" response.
//             response.tellWithCard(speechOutput, "Wise Guy", cardOutput);
//         } else {

//             session.attributes.stage = 1;
//             speechText = "That's not how knock knock jokes work! <break time=\"0.3s\" /> "
//                 + "Knock knock!";
//             cardOutput = "That's not how knock knock jokes work! "
//                 + "Knock knock!";

//             repromptText = "You can ask who's there.";

//             speechOutput = {
//                 speech: speechText,
//                 type: AlexaSkill.speechOutputType.SSML
//             };
//             repromptOutput = {
//                 speech: repromptText,
//                 type: AlexaSkill.speechOutputType.PLAIN_TEXT
//             };
//             //If the joke has to be restarted, this function uses an "ask" response.
//             response.askWithCard(speechOutput, repromptOutput, "Wise Guy", cardOutput);
//         }
//     } else {
//         speechText = "Sorry, I couldn't correctly retrieve the joke. "
//             + "You can say, tell me a joke";

//         repromptText = "You can say, tell me a joke";

//         speechOutput = {
//             speech: speechText,
//             type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         };
//         repromptOutput = {
//             speech: repromptText,
//             type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         };
//         response.askWithCard(speechOutput, repromptOutput, "Wise Guy", speechOutput);
//     }
// }

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new VoiceGame();
    skill.execute(event, context);
};
