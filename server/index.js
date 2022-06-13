const fileUpload = require('express-fileupload')
const filePathMiddleware = require('./middleware/filepath.middleware');
const path = require('path');
const config = require('config');

const authRouter = require('./routes/auth.routes');
const roomRouter = require('./routes/room.routes');
const messageRouter = require('./routes/message.routes')
const userRouter = require('./routes/user.routes')

const connectWSRoutes = require('./routes/WSroutes/connectWSRoutes.js')
const roomWSRoutes = require('./routes/WSroutes/roomWSRoutes.js')
const messageWSRoutes = require('./routes/WSroutes/messageWSRoutes.js')
const disconnectWSRoutes = require('./routes/WSroutes/disconnectWSRoutes.js')

const corsMiddleWare = require('./middleware/cors.middleware')
const cors = require('cors')

const mongoose = require('mongoose');

const socket = require('socket.io');
const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = socket(server, {
	cors: {
		origin: "*",
	},
})

const PORT = process.env.PORT || config.get('serverPort')
const DBurl = config.get('dbUrl')

app.use(fileUpload({}))
app.use(cors())
app.use(corsMiddleWare)
app.use(filePathMiddleware(path.resolve(__dirname, 'static')))

app.use(express.json())
app.use(express.static('static'))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/room', roomRouter)
app.use('/api/message', messageRouter)

io.on('connection', socket => {
	connectWSRoutes.setWSConnection(socket)
	roomWSRoutes.connectToRoom(socket, io)
	roomWSRoutes.clearRoom(socket)
	messageWSRoutes.createMessage(socket, io)
	messageWSRoutes.deleteMessage(socket, io)
	messageWSRoutes.editMessage(socket, io)
	disconnectWSRoutes.breakWSConnection(socket)

})

const start = async () => {
	try {
		await mongoose.connect(DBurl)
		server.listen(PORT, () => console.log(`Server has been started on ${PORT} port`))
	} catch (e) {
		console.log('An error occurred when starting the server' + e)
	}
};

start()