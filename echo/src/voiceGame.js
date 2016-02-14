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

var s = [];

s[1] = "Hello Hello… Can you hear me?";
s[2] = "Oh gosh, I have such a headache.  Everything’s fuzzy.  What happened? ohhh, I remembered that our ship crashed ! But where am I?  It seems like i am on an island….";
s[3] = "I have to find a way back home, Evan must be waiting for me. But I need to survive here first…the sun is setting, what should I do?";
s[4] = "Okay, a cave will provide me a place to keep me warm tonight. But I’m so hungry, I think I must go find some food tomorrow or I would starve to death. What can I look for? ";
s[5] = "Yeah, fish sounds good.  But, lets do that tomorrow, I really need to rest now. Good night.";
s[6] = "What a night!  I couldn't sleep very well.  I had a dream that I was back home with Eli. Anyways, What should I do now?";
s[7] = "Oh look over there, by the wreckage; it looks like another survivor?!  Should I go talk with him?";
s[8] = "Stay away from me. Leave me alone.";
s[9] = "Calm down man, I’m not a bad person.";

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
        session.attributes.stage = 1;
      } else if (session.attributes.stage === 10) {
        response.tell('The game ends.');
        return;
      }


      // session.attributes.stage ++;
    //   if(session.attributes.stage === 2) {
    //     var speechOutput = {};
    //     speechOutput.speech = "<speak>"
    //           + "<audio src='https://s3.amazonaws.com/ask-storage/tidePooler/OceanWaves.mp3'/>"
    //           + s[1]
    //           + "</speak>";
    //      speechOutput.type = AlexaSkill.speechOutputType.SSML;
    //      response.ask(speechOutput, speechOutput);
    //      return;
    //   }
    // var output = {
    //   speech: s[session.attributes.stage - 1],
    //   type: AlexaSkill.speechOutputType.PLAIN_TEXT
    // };

    // response.ask(output, output);




      if(session.attributes.stage === 1) {
        var speechOutput = {};
        speechOutput.speech = "<speak>"
              + "<audio src='https://s3.amazonaws.com/ask-storage/tidePooler/OceanWaves.mp3'/>"
              + "<audio src='https://s3.amazonaws.com/voicegame/01.mp3'/>"
              + "</speak>";
         speechOutput.type = AlexaSkill.speechOutputType.SSML;
         session.attributes.stage ++;
         response.ask(speechOutput, speechOutput);
         return;
      }
      var url = 'https://s3.amazonaws.com/voicegame/0'+ session.attributes.stage +'.mp3';
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
    var outputText = "Welcome to mental health assistant. I am waiting for you. You looks nice today. Let's play some interesting games together.";
    var output = {
      speech: outputText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    // var speechOutput = {
    //      speech: "<speak>"
    //           + "Hello <audio src='https://s3.amazonaws.com/voicegame/l01.mp3'/> Howdy"
    //           + "</speak>",
    //         type: AlexaSkill.speechOutputType.SSML
    //     };

    //   response.ask(speechOutput, speechOutput);

    response.ask(output, output);
}