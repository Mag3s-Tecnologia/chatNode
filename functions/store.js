const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { blackListWords } = require("../statics/blackListWords");
const { replaceAt } = require('../utils/replaceAt');

async function messageWordsValidation(/** @type { string } */message, /** @type {"PT" | "EN" | "ES"} */ lang) {
  return new Promise((resolve) => {
    const replaceTo = "*";
    /** @type { string[] } */
    const words = blackListWords || [];
    const rgx = new RegExp(words.join("|"), "g");

    const disallowedWordsFiltered = String(message).match(rgx);
    const matchAll = [...String(message)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .matchAll(rgx)]

    matchAll
      .forEach((match) => {
        const word = match[0];
        const replacement = new Array(word.length).fill(replaceTo).join("");
        const index = match.index;
        // console.log(message)
        // console.log(word, index, word.length)
        message = replaceAt(message, index, (index + word.length), replacement);
        // console.log(message)
      });

    resolve({ message, disallowedWordsFiltered });
  })
}

async function storeChatMessage(roomId, message) {
  const chatMessages = getChatMessages(roomId);
  const lastMessage = chatMessages[chatMessages.length - 1];

  const messageValidation = await messageWordsValidation(message.message, message.locale);
  message = { ...message, ...messageValidation };

  message.time = new Date();
  message.createdAt = new Date();

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
    } else {
      approval = true;
      message.time = new Date().toLocaleTimeString();
    }
  } else {
    approval = true;
    message.time = new Date().toLocaleTimeString();
  }
  if (approval) {
    chatMessages.push(message);
    const date = new Date().toISOString().slice(0, 10);
    const dir = path.join(__dirname, '../messages');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${roomId}/${date}.json`, JSON.stringify(chatMessages));
    delete message.disallowedWordsFiltered;
    delete message.locale;
    return {
      'status': 'success',
      'message': 'Mensagem enviada com sucesso!',
      data: message,
    }
  }
}

function getChatMessages(roomId) {
  const date = new Date().toISOString().slice(0, 10);
  const dir = path.join(__dirname, '../messages');
  const filePath = `${dir}/${roomId}/${date}.json`;
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    const filteredData = data
      .filter(message => message.message !== '')
      .slice(-50)
      .map(({ disallowedWordsFiltered, locale, ...rest }) => rest);

    return filteredData
  } else {
    const dataPrimal = [{
      username: 'Chatbot',
      message: 'Bem-vindo ao chat! 🎉',
      time: new Date().toLocaleTimeString()
    }];

    if (!fs.existsSync(`${dir}/${roomId}`)) {
      fs.mkdirSync(`${dir}/${roomId}`, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${roomId}/${date}.json`, JSON.stringify(dataPrimal));
    const data = JSON.parse(fs.readFileSync(`${dir}/${roomId}/${date}.json`));
    const filteredData = data
      .filter(message => message.message !== '')
      .slice(-50)
      .map(({ disallowedWordsFiltered, locale, ...rest }) => rest);
    return filteredData;
  }
}

function deleteChatMessages(roomId, dateInput = false) {
  let date;
  if (!dateInput) {
    date = new Date().toISOString().slice(0, 10);
  } else {
    date = dateInput;
  }
  const dir = path.join(__dirname, '../messages');
  const filePath = `${dir}/${roomId}/${date}.json`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return {
      'status': 'success',
      'message': 'Mensagens deletadas'
    }
  } else {
    return {
      'status': 'error',
      'message': 'Nenhuma mensagem encontrada'
    }
  }
}

module.exports = {
  getChatMessages,
  storeChatMessage,
  deleteChatMessages
};
