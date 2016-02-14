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
    session.attributes.stage = 1;
    handleWelcomeRequest(response);
};

VoiceGame.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("VoiceGame onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

VoiceGame.prototype.intentHandlers = {
    "ConfirmYes": function (intent, session, response) {
      if(!session.attributes.stage) {
        session.attributes.stage = 0;
      }
      var url = 'https://s3.amazonaws.com/voicegame/0'+session.attributes.stage+'.m4a';
      session.attributes.stage ++;

      var speechOutput = {
            speech: "<speak>"
                + "<audio src='" + url + "'/>"
                + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };

      response.ask(speechOutput, speechOutput);
    },

    "ConfirmNo": function (intent, session, response) {
      response.tell('You have killed her!');
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Game stop";
        response.tell(speechOutput);
    },
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new VoiceGame();
    skill.execute(event, context);
};


function handleWelcomeRequest(response) {
    var outputText = "Welcome to metal health assistant. I am waiting for you. You looks nice today. Let's play some interesting games together.";
    var output = {
      speech: outputText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    response.ask(output, output);
}