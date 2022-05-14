const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRouter = require('./routes/auth.routes');
const roomRouter = require('./routes/room.routes');
const messageRouter = require('./routes/message.routes')
const userRouter = require('./routes/user.routes')
const corsMiddleWare = require('./middleware/cors.middleware')
const chatRoom = require("./models/chat-room")
const jwt = require('jsonwebtoken')
const { json } = require('express');
const User = require('./models/user')
const Message = require('./models/message')
const cors = require('cors')
const socket = require('socket.io');
const fileUpload = require('express-fileupload')
const authMiddleware = require('./middleware/auth.middleware');

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
app.use(express.json())
app.use(express.static('static'))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/room', roomRouter)
app.use('/api/message', messageRouter)
io.on('connection', socket => {
	socket.on('user-connection',
		async (data) => {
			const user = User.findOne({ _id: data.userid })
			await User.findOneAndUpdate({ _id: data.userid }, { info: { ...user.info, online: true }, socketid: socket.id })
		}
	)
	socket.on('connect-to-room',
		async (data) => {
			const { roomid, userid } = data
			socket.join(roomid)
			const user = await User.findOne({ _id: userid })
			let room = await chatRoom.findOne({ _id: roomid }, { users: 1, usernames: 1, roomname: 1, role: 1, avatar: 1, description: 1, links: 1 })
			if (room.usernames) {
				let close = false
				room.users.forEach((user) => {
					if (user.toString() === userid) {
						close = true
					}
				})
				if (close) {
					io.to(roomid).emit('connect-to-room', { room })
					return
				}
			}
			user.rooms.push(room)
			await User.findOneAndUpdate({ _id: userid }, { rooms: user.rooms })
			room.users.push(userid)
			room.usernames.push(user.username)
			let updatedRoom = await chatRoom.findOneAndUpdate({ _id: roomid }, { users: room.users, usernames: room.usernames, $push: { role: { userid: user._id, role: 'User' } } })
			updatedRoom = await chatRoom.findOne({ _id: roomid }, { users: 1, usernames: 1, roomname: 1, role: 1, avatar: 1, description: 1, links: 1 })
			io.to(roomid).emit('connect-to-room', { room: updatedRoom })
			return
		})
	socket.on('clear-room',
		() => {
			socket.adapter.rooms.forEach((e, k) => {
				if (k != socket.id) {
					socket.leave(k)
				}
			})
		}
	)
	socket.on('new-message',
		async (data) => {
			const { message, userid, roomid } = data;
			const user = await User.findOne({ _id: userid })
			const date = new Date()
			let month = date.getMonth().toString()
			let day = date.getDate().toString()
			let hours = date.getHours().toString()
			let minutes = date.getMinutes().toString()
			let seconds = date.getSeconds().toString()
			if ((date.getMonth() + 1) < 10) {
				month = `0${date.getMonth() + 1}`
			}
			if (date.getDate() < 10) {
				day = `0${date.getDate()}`
			}
			if (date.getHours() < 10) {
				hours = `0${date.getHours()}`
			}
			if (date.getMinutes() < 10) {
				minutes = `0${date.getMinutes()}`
			}
			if (date.getSeconds() < 10) {
				seconds = `0${date.getSeconds()}`
			}
			const dateObj = {
				year: date.getFullYear().toString(),
				month: month,
				day: day,
				hours: hours,
				minutes: minutes,
				seconds: seconds
			}
			const time = (dateObj.hours + ':' + dateObj.minutes).toString()
			const newMessage = new Message({ user_id: userid, date: dateObj, time: time, username: user.username, mess: message, room_id: roomid })
			await newMessage.save()
			await chatRoom.updateOne({ _id: roomid }, { $push: { messages: newMessage } })
			io.to(roomid).emit('new-message', { message: newMessage })
		}
	)
	socket.on('disconnect',
		async () => {
			const user = await User.findOne({ socketid: socket.id })
			if (!user) {
				return
			}
			await User.findOneAndUpdate({ socketid: socket.id }, { info: { ...user.info, online: false }, socketid: null })
		})
})

const start = async () => {
	try {

		await mongoose.connect(DBurl)

		server.listen(PORT, () => console.log(`Server has been started on ${PORT} port`))
	} catch (e) {

	}
};

start()