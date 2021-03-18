const SocketIO = require('socket.io');
const {getClaims, getClaimDetails} = require('./fhir-service');

const {trigger, reply, alternative, coronavirus} = require('./data');

async function proccessMessage(patientId, message) {
    let output;
  
    //Transforms whatever the user inputs to lowercase and remove all chars except word characters, space, and digits
    let text = message.toLowerCase().replace(/[^\w\s\d-]/gi, "");
  
    // For example 'tell me a story' becomes 'tell me story'
    // Or 'i feel happy' -> 'happy'
    text = text
      .replace(/ a /g, " ")
      .replace(/i feel /g, "")
      .replace(/whats/g, "what is")
      .replace(/please /g, "")
      .replace(/ please/g, "")
      .replace(/on /g, "")
      .replace(/with /g, "")
      .replace(/my /g, "");
  
    if (!patientId) {
      patientId = "DaisyBarnes";
    }

    if (text.indexOf("claim details") >= 0) {
      console.log(text);
      const res = await getClaimDetails(patientId, text.match(/\d{4}-\d{1,2}-\d{1,2}/));
      if (res) {
        output = res;
      } else {
        output = alternative[Math.floor(Math.random() * alternative.length)];
      }
    } else if (text.indexOf("claims provider") >= 0) {

    } else if (text.indexOf("claims") >= 0) {
      const res = await getClaims(patientId);
      if (res) {
        output = res;
      } else {
        output = alternative[Math.floor(Math.random() * alternative.length)];
      }
    } else {
      // Searches for an exact match with the 'trigger' array, if there are none, random alternative
      const match = compare(trigger, reply, text)
      if (match) {
        output = match;
      } else if (text.match(/coronavirus/gi)) {
        output = coronavirus[Math.floor(Math.random() * coronavirus.length)];
      } else {
        output = alternative[Math.floor(Math.random() * alternative.length)];
      }
    }
    return output
  }
  
  function compare(triggerArray, replyArray, string) {
    let item;
    for (let x = 0; x < triggerArray.length; x++) {
      for (let y = 0; y < replyArray.length; y++) {
        if (triggerArray[x][y] == string) {
          item = replyArray[x][Math.floor(Math.random() * items.length)];
        }
      }
    }
    return item;
  }

function setSocketInstance (server) {
const io = SocketIO(server);
  io.on('connection', (socket) => {
      socket.on('message', async (data) => {
        const output = await proccessMessage(data.patientId, data.message);
        const replyData = {
            outputMessage : output
        }
        socket.emit('reply', replyData);
      });
  });

};

module.exports = { setSocketInstance };

