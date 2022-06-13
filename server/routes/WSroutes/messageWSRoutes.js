const chatRoomModel = require("../../models/chatRoomModel");
const messageModel = require("../../models/messageModel");
const userModel = require("../../models/userModel");

const createMessage = (socket, io) => {
	socket.on('new-message',
		async (data) => {
			const { message, userid, roomid, replyid } = data;
			let user = await userModel.findOne({ _id: userid })
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
			if (replyid) {
				const newMessage = new messageModel({
					user_id: userid,
					date: dateObj,
					time: time,
					username: user.username,
					mess: message,
					room_id: roomid,
					inheritance: replyid
				})
				await newMessage.save()
				await chatRoomModel.updateOne({ _id: roomid }, { $push: { messages: newMessage } })
				return io.to(roomid).emit('new-message', { message: newMessage })
			}
			const newMessage = new messageModel({
				user_id: userid,
				date: dateObj,
				time: time,
				username: user.username,
				mess: message,
				room_id: roomid
			})
			await newMessage.save()
			await chatRoomModel.updateOne({ _id: roomid }, { $push: { messages: newMessage } })
			return io.to(roomid).emit('new-message', { message: newMessage })
		}
	)
}

const deleteMessage = (socket, io) => {
	socket.on('delete-message',
		async data => {
			const { messageid, roomid } = data
			const message = await messageModel.findOne({ _id: messageid })
			await chatRoomModel.updateOne({ _id: roomid }, { $pull: { messages: message } })
			return io.to(roomid).emit('delete-message', { message: 'delete message success' })
		}
	)
}
const editMessage = (socket, io) => {
	socket.on('edit-message',
		async data => {
			const { roomid, messageid, message } = data
			let room = await chatRoomModel.findOne({ _id: roomid })
			room.messages.forEach(async forEachmessage => {
				if (forEachmessage._id.toString() === messageid) {
					forEachmessage.mess = message
					await messageModel.updateOne({ _id: messageid }, { mess: message })
				}
			});
			await chatRoomModel.updateOne({ _id: roomid }, { messages: room.messages })
			return io.to(roomid).emit('edit-message', { message: 'edit message success' })
		}
	)
}
module.exports = {
	createMessage: createMessage,
	deleteMessage: deleteMessage,
	editMessage: editMessage,
}