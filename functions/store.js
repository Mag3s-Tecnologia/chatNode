const fs = require('fs');
const path = require('path');
const moment = require('moment');

function storeChatMessage(roomId, message) {
  const chatMessages = getChatMessages(roomId);
  const lastMessage = chatMessages[chatMessages.length - 1];
  message.time = new Date();
  let approval = false;
  if (lastMessage && lastMessage.username === message.username) {
      const format = 'h:mm:ss A';
      const lastMessageTime = moment(lastMessage.time, format).valueOf();
      const messageTime = moment(message.time, format).valueOf();

      // Verificar se mandaram a mensagem a mais de 5 segundos
      if (messageTime - lastMessageTime < 5000) {
        approval = false;
        return {
          'status': 'error',
          'message': 'Você está enviando mensagens muito rápido! Espere 5 segundos para enviar outra mensagem.'
        }
      }else{
        approval = true;
        message.time = new Date().toLocaleTimeString();
      }
  }else{
    approval = true;
    message.time = new Date().toLocaleTimeString();
  }
  if (approval) {
    chatMessages.push(message);
    const date = new Date().toISOString().slice(0,10); // get current date in YYYY-MM-DD format
    const dir = path.join(__dirname, '../messages');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(`${dir}/messages-${roomId}-${date}.json`, JSON.stringify(chatMessages));
    return {
      'status': 'success',
      'message': 'Mensagem enviada com sucesso!'
    }
  }
}
function getChatMessages(roomId) {
  const date = new Date().toISOString().slice(0,10); // get current date in YYYY-MM-DD format
  const dir = path.join(__dirname, '../messages');
  const filePath = `${dir}/${roomId}/${date}.json`;
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    const filteredData = data.filter(message => message.message !== '').slice(-50);

    return filteredData
  } else {
    const dataPrimal = [
      {
        username: 'Chatbot',
        message: 'Bem-vindo ao chat! 🎉',
        time: new Date().toLocaleTimeString()
      }
    ];

    if (!fs.existsSync(`${dir}/${roomId}`)){
      fs.mkdirSync(`${dir}/${roomId}`, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${roomId}/${date}.json`, JSON.stringify(dataPrimal));
    const data = JSON.parse(fs.readFileSync(`${dir}/messages/${roomId}/${date}.json`));
    const filteredData = data.filter(message => message.message !== '').slice(-50);
    return filteredData;
  }
}
module.exports = {
  getChatMessages,
  storeChatMessage
};
