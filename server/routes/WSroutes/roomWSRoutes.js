const chatRoomModel = require("../../models/chatRoomModel")
const userModel = require("../../models/userModel")

const connectToRoom = (socket, io) => {
	socket.on('connect-to-room',
		async (data) => {
			const { roomid, userid } = data
			socket.join(roomid)
			let user = await userModel.findOne({ _id: userid })
			const room = await chatRoomModel.findOne({ _id: roomid }, { users: 1, usernames: 1, roomname: 1, role: 1, avatar: 1, description: 1, links: 1 })
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
			await userModel.findOneAndUpdate({ _id: userid }, { rooms: user.rooms })
			room.users.push(userid)
			room.usernames.push(user.username)
			await chatRoomModel.updateOne({ _id: roomid }, { users: room.users, usernames: room.usernames, $push: { role: { userid: user._id, role: 'User' } } })
			const updatedRoom = await chatRoomModel.findOne({ _id: roomid }, { users: 1, usernames: 1, roomname: 1, role: 1, avatar: 1, description: 1, links: 1 })
			io.to(roomid).emit('connect-to-room', { room: updatedRoom })
			return
		})
}
const clearRoom = (socket) => {
	socket.on('clear-room',
		() => {
			socket.adapter.rooms.forEach((e, k) => {
				if (k != socket.id) {
					socket.leave(k)
				}
			})
		}
	)
}
module.exports = {
	connectToRoom: connectToRoom,
	clearRoom: clearRoom,
}
