const Router = require("express")
const chatRoom = require("../models/chat-room")
const User = require('../models/user.js')
const Uuid = require('uuid')
const fs = require("fs")
const authMiddleware = require("../middleware/auth.middleware")
const config = require('config')
const filePathMiddleware = require('../middleware/filepath.middleware');
const path = require('path')


const router = new Router()

router.post('/get-user',
	async (req, res) => {
		try {
			let { userID } = req.body
			let user = await User.findOne({ _id: userID }, { password: 0, socketid: 0 })
			res.status(200).json({ user })
		} catch (e) {
			res.json({ message: 'Server error' })
		}
	})
router.post('/get-users',
	async (req, res) => {
		try {
			let { roomid } = req.body
			room = await chatRoom.findOne({ _id: roomid })
			users = await User.find({ _id: { $in: room.users } }, { password: 0, socketid: 0 })
			res.status(200).json({ users })
		} catch (e) {
			res.json({ message: 'Server error' })
		}
	})
router.post('/upload-avatar', authMiddleware,
	async (req, res) => {
		try {
			const file = req.files.file
			const user = await User.findOne({ _id: req.user.id })
			const avatarName = Uuid.v4() + '.jpg'
			file.mv(filePathMiddleware(path.resolve(__dirname, 'static')) + "\\" + avatarName)
			user.avatar = avatarName
			await user.save()
			res.status(200).json({ user })
		} catch (e) {
			res.json({ message: 'Upload avatar error' })
		}
	})
router.delete('/delete-avatar',
	async (req, res) => {
		try {
			const user = await User.findOne({ _id: req.body.userID })
			fs.unlinkSync((filePathMiddleware(path.resolve(__dirname, 'static')) + '\\' + user.avatar))
			user.avatar = null
			await user.save()
			res.status(200).json(user)
		} catch (e) {
			res.json({ message: 'Delete avatar error' })
		}
	})

module.exports = router;