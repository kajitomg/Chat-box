import socket from "../../../client/src/socket"

export const connectToRoom = (socket) => {
	return (async (data) => {
		const { roomid, userid } = data
		socket.join(roomid)
		console.log(io.sockets)
		const user = await User.findOne({ _id: userid })
		let room = await chatRoom.findOne({ _id: roomid }, { users: 1, usernames: 1, roomname: 1 })
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
		let updatedRoom = await chatRoom.findOneAndUpdate({ _id: roomid }, { users: room.users, usernames: room.usernames })
		updatedRoom = await chatRoom.findOne({ _id: roomid }, { users: 1, usernames: 1, roomname: 1 })
		room = updatedRoom
		io.to(roomid).emit('connect-to-room', { room })
		return
	})()
}

