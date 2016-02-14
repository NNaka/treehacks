var APP_ID = "amzn1.echo-sdk-ams.app.d33d184a-1d5e-4a34-9867-3b8b173e1467"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

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
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

VoiceGame.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("VoiceGame onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

VoiceGame.prototype.intentHandlers = {
    "GameStartIntent": function (intent, session, response) {
        response.tell('Game Start. What do you like?');
    },

    "SaveBoy": function (intent, session, response) {
      session.attributes.choice = 'save';
      var res = "Do you really want to save him?";
      response.ask(res, res);
    },

    "KillBoy": function (intent, session, response) {
      session.attributes.choice = 'kill';
      var res = "Do you really want to kill him?";
      response.ask(res, res);
    },

    "ConfirmYes": function (intent, session, response) {
      if (session.attributes.choice) {
        response.tell('You have ' + session.attributes.choice + 'd him.');
      }
      else {
        response.tell('It is a wrong choice.');
      }
    },

    "ConfirmNo": function (intent, session, response) {
      if (session.attributes.choice) {
        response.tell('You have cancelled your choice.');
      }
      else {
        response.tell('It is a wrong choice.');
      }
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

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new VoiceGame();
    skill.execute(event, context);
};


function handleWelcomeRequest(response) {
    var whichAction = "There is a cute boy. So you wanna kill him or save him? ";
    var speechOutput = {
            speech: "<speak>Welcome to the voice game. "
                + "<audio src='https://s3.amazonaws.com/ask-storage/tidePooler/OceanWaves.mp3'/>"
                + whichAction
                + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        },
        repromptOutput = {
            speech: "The game is waiting for you."
                + whichAction,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

    response.ask(speechOutput, repromptOutput);
}