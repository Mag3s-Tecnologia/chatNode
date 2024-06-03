const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const functions = require('./functions/store.js');

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
  res.render('index.html')
})
io.on('connection', socket => {
  socket.on('joinRoom', ({roomId}) => {
      socket.join(roomId)
      let chatMessages = functions.getChatMessages(roomId);
      io.in(roomId).emit('previousMessages', chatMessages)
  })

  socket.on('sendMessage', ({roomId, username, message}) => {
    let messageObj = {username: username, message: message}
    const data = functions.storeChatMessage(roomId, messageObj)
    if (data.status == 'success') {
      io.in(roomId).emit('receivedMessage', messageObj)
    }else{
      socket.emit('error', data.message)
    }
  })
})
server.listen(3001)
