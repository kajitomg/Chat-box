const Router = require("express")
const chatRoomModel = require("../models/chatRoomModel")
const userModel = require('../models/userModel')
const Uuid = require('uuid')
const fs = require("fs")
const authMiddleware = require("../middleware/auth.middleware")


const router = new Router()

router.post('/get-user',
	async (req, res) => {
		try {
			const { userid } = req.body
			const user = await userModel.findOne({ _id: userid }, { password: 0, socketid: 0 })
			res.status(200).json({ user })
		} catch (e) {
			res.json({ message: 'Server error' })
		}
	})
router.post('/get-users',
	async (req, res) => {
		try {
			const { roomid } = req.body
			const room = await chatRoomModel.findOne({ _id: roomid })
			const users = await userModel.find({ _id: { $in: room.users } }, { password: 0, socketid: 0 })
			res.status(200).json({ users })
		} catch (e) {
			res.json({ message: 'Server error' })
		}
	})
router.post('/upload-avatar', authMiddleware,
	async (req, res) => {
		try {
			const file = req.files.file
			const user = await userModel.findOne({ _id: req.user.id })
			const avatarName = Uuid.v4() + '.jpg'
			file.mv(req.filePath + "/" + avatarName)
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
			const { userid } = req.body
			const user = await userModel.findOne({ _id: userid })
			fs.unlinkSync((req.filePath + '/' + user.avatar))
			user.avatar = null
			await user.save()
			res.status(200).json(user)
		} catch (e) {
			res.json({ message: 'Delete avatar error' })
		}
	})

module.exports = router;