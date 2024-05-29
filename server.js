const express = require('express')
const path = require('path')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
  res.render('index.html')
})

let chatRooms = {}

io.on('connection', socket => {
  socket.on('joinRoom', ({roomId}) => {
      socket.join(roomId)
      if (!chatRooms[roomId]) {
          chatRooms[roomId] = []
      }
      socket.emit('previousMessages', chatRooms[roomId])
  })

  socket.on('sendMessage', ({roomId, username, message}) => {
      let messageObj = {username: username, message: message}
      chatRooms[roomId].push(messageObj)
      socket.to(roomId).emit('receivedMessage', messageObj)
  })
})

server.listen(3000)
