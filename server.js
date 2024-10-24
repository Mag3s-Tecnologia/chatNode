const express = require('express')
const cors = require('cors');
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const functions = require('./functions/store.js');

app.use(cors({
  origin: '*'
}))

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.get('/', (req, res) => {
  res.render('index.html')
})
io.on('connection', (socket) => {

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId)
    let chatMessages = functions.getChatMessages(roomId);
    io.in(roomId).emit('previousMessages', chatMessages)
  })

  socket.on('sendMessage', async ({ roomId, ...data }) => {
    const res = await functions.storeChatMessage(roomId, data)
    if (res.status == 'success') {
      io.in(roomId).emit('receivedMessage', res.data);
    } else {
      socket.emit('error', data.message)
    }
  })
})

// Endpoint tipo get para trazer o getMessage recebendo via parametro o roomId
app.get('/getMessage', (req, res) => {
  const roomId = req.query.roomId;
  if (!roomId) {
    res.status(400).send('roomId is required');
  }
  const chatMessages = functions.getChatMessages(roomId);
  res.send(chatMessages);
})

// Endpoint para deletar o arquivo de mensagem pelo roomId
app.delete('/deleteMessage', (req, res) => {
  const roomId = req.query.roomId;
  let data;

  if (!roomId) {
    res.status(400).send('roomId is required');
  }

  if (req.query.date) {
    data = functions.deleteChatMessages(roomId, req.query.date);
  } else {
    data = functions.deleteChatMessages(roomId);
  }
  if (data.status == 'success') {
    res.status(200).send('Mensagens deletadas com sucesso!');
  } else {
    res.status(400).send(data.message);
  }
})

const port = process.env.NODE_ENV == "development" ? 8084 : 3001;

server.listen(port, () => {
  console.log("Environment:", process.env.NODE_ENV);
  console.log(`Server Started On http://localhost:${port}`);
});
