const Router = require("express")
const chatRoom = require("../models/chat-room")
const User = require('../models/user.js')
const events = require('events')

const emitter = new events.EventEmitter()


const router = new Router()

router.post('/get-user',
	async (req, res) => {
		try {
			let { userID } = req.body
			let user = await User.findOne({ _id: userID }, { password: 0, socketid: 0 })
			res.status(200).json({ user: user })
		} catch (e) {
			res.json({ message: 'Server error' })
		}
	})

module.exports = router;