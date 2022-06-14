const Router = require('express')
const events = require('events');
const chatRoomModel = require('../models/chatRoomModel');
const userModel = require('../models/userModel')
const messageModel = require('../models/messageModel');
const emitter = new events.EventEmitter()
const router = new Router();


router.post('/get-reply-messages',
	async (req, res) => {
		try {
			const { messagesid } = req.body
			const messages = await messageModel.find({ _id: messagesid })
			return res.status(200).json({ messages: messages })
		} catch (e) {
			return res.status(400).json({ message: 'Server error' })
		}
	}

)

router.post('/load-messages',
	async (req, res) => {
		try {
			const { roomid, lastmessid } = req.body
			const quantity = 15
			let room = await chatRoomModel.findOne({ _id: roomid }, { messages: 1 })
			let total = room.messages.length
			let revMessages = room.messages.reverse()
			let messages = []
			let go
			if (lastmessid) {
				go = false
				revMessages.forEach(mess => {
					if (mess._id.toString() === lastmessid) {
						go = true;
						return
					}
					if (go) {
						if (messages.length < quantity) {
							messages.push(mess)
						}
					}
				})
				messages.reverse()
			}
			else if (!lastmessid) {
				go = true
				revMessages.forEach(mess => {
					if (messages.length === quantity) {
						go = false;
						return
					}
					if (go) {
						messages.push(mess)
					}
				})
				messages.reverse()
				total = revMessages.length
			}
			return res.status(200).json({ messages: messages, total: total })
		} catch (e) {
			return res.status(400).json({ message: 'Server error' })
		}
	}

)

module.exports = router;