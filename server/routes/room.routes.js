const Router = require("express")
const chatRoomModel = require("../models/chatRoomModel")
const userModel = require('../models/userModel.js')
const messageModel = require("../models/messageModel")
const authMiddleware = require('../middleware/auth.middleware.js')
const authPostMiddleware = require('../middleware/authPost.middleware')
const Uuid = require('uuid')
const fs = require("fs")



const router = new Router()

router.post('/create-room', authPostMiddleware,
	async (req, res) => {
		try {
			const { roomname } = req.body
			const user = await userModel.findOne({ _id: req.user.id })
			const createRoom = new chatRoomModel({ users: [user], usernames: [user.username], roomname, roomname_lower: roomname.toLowerCase(), messages: [], role: [{ userid: user._id, role: 'Creator' }] })
			await createRoom.save()
			user.rooms.push(createRoom)
			await userModel.findOneAndUpdate({ _id: user._id }, { rooms: user.rooms })
			let resRoom = { id: createRoom._id, users: [user._id], usernames: [user.username], roomname: createRoom.roomname, role: createRoom.role }
			return res.json({ room: resRoom })
		} catch (e) {
			return res.json({ message: 'Server error' })
		}
	})

router.get('/load-rooms', authMiddleware,
	async (req, res) => {
		try {
			const user = await userModel.findOne({ _id: req.user.id })
			let roomsBody = await chatRoomModel.find({ _id: { $in: user.rooms } })
			let resRooms = []
			roomsBody.forEach((room, id) => {
				resRooms = [...resRooms, { id: room._id, users: room.users, usernames: room.usernames, roomname: room.roomname, avatar: room.avatar }]
			})
			return await res.json({ rooms: resRooms })
		} catch (e) {
			res.send({ message: 'Server error' })
		}
	}
)
router.post('/delete-room',
	async (req, res) => {
		try {
			const { userid, roomid } = req.body
			await userModel.updateMany({ rooms: roomid }, { $pull: { rooms: roomid } })
			await chatRoomModel.deleteOne({ _id: roomid })
			const user = await userModel.findOne({ _id: userid })
			const roomsBody = await chatRoomModel.find({ _id: { $in: user.rooms } })
			let resRooms = []
			roomsBody.forEach((room) => {
				resRooms = [...resRooms, { id: room._id, users: room.users, usernames: room.usernames, roomname: room.roomname, }]
			})
			return await res.json({ rooms: resRooms })
		} catch (e) {
			return res.send({ message: 'Server error' })
		}
	}
)
router.post('/leave-room',
	async (req, res) => {
		try {
			const { userid, roomid } = req.body
			const user = await userModel.findOneAndUpdate({ _id: userid }, { $pull: { rooms: roomid } })
			await chatRoomModel.updateOne({ _id: roomid }, { $pull: { users: userid, usernames: user.username, role: { userid: user._id } } })
			return res.status(200)
		} catch (e) {
			return res.send({ message: 'Server error' })
		}
	}
)

router.post('/search-rooms',
	async (req, res) => {
		try {
			const { roomname } = req.body
			const rooms = await chatRoomModel.find({ roomname_lower: roomname.toLowerCase() })
			let resRooms = []
			rooms.forEach((room, id) => {
				resRooms = [...resRooms, { id: room._id, users: room.users, usernames: room.usernames, roomname: room.roomname, avatar: room.avatar }]
			})
			return res.status(200).json({ rooms: resRooms })
		} catch (e) {
			return res.send({ message: 'Server error' })
		}
	}
)
router.post('/get-user',
	async (req, res) => {
		try {
			const { userid } = req.body;
			const user = await userModel.findOne({ _id: userid, })
			const username = user.username
			return res.json(username)
		} catch (e) {
			console.log(e)
			return res.send({ message: 'Server error' })
		}
	}
)
router.post('/get-users',
	async (req, res) => {
		try {
			const { usersid } = req.body
			let usernames = []
			usersid.forEach(async (userid, i) => {
				const username = await userModel.findOne({ _id: userid })
				usernames[i] = username.username
			});
			return res.json({ usernames })
		} catch (e) {
			console.log(e)
			return res.send({ message: 'Server error' })
		}
	}
)
router.post('/upload-avatar',
	async (req, res) => {
		try {
			const roomid = req.body.data
			const file = req.files.file
			const room = await chatRoomModel.findOne({ _id: req.body.data })
			const avatarName = Uuid.v4() + '.jpg'
			file.mv(req.filePath + "/" + avatarName)
			room.avatar = avatarName
			await room.save()
			return res.status(200).json({ room })
		} catch (e) {
			return res.json({ message: 'Upload avatar error' })
		}
	})

router.post('/delete-avatar',
	async (req, res) => {
		try {
			const { roomid } = req.body
			const room = await chatRoomModel.findOne({ _id: roomid })
			fs.unlinkSync(req.filePath + "/" + room.avatar)
			room.avatar = null
			await room.save()
			return res.status(200).json({ room })
		} catch (e) {
			return res.json({ message: 'Delete avatar error' })
		}
	})
router.post('/edit-name',
	async (req, res) => {
		try {
			const { roomid, roomname } = req.body
			const room = await chatRoomModel.findOne({ _id: roomid })
			room.roomname = roomname
			room.roomname_lower = roomname.toLowerCase()
			await room.save()
			return res.status(200).json({ room })
		} catch (e) {
			return res.json({ message: 'Edit name error' })
		}
	})
router.post('/edit-description',
	async (req, res) => {
		try {
			const { roomid, roomdescription } = req.body
			const room = await chatRoomModel.findOne({ _id: roomid })
			room.description = roomdescription
			await room.save()
			return res.status(200).json({ room })
		} catch (e) {
			return res.json({ message: 'Edit description error' })
		}
	})
router.post('/create-link',
	async (req, res) => {
		try {
			const { roomid, linkname, link } = req.body
			const room = await chatRoomModel.findOne({ _id: roomid })
			const roomlink = { linkname: linkname, link: link, id: Uuid.v4() }
			room.links.push(roomlink)
			await room.save()
			return res.status(200).json({ room })
		} catch (e) {
			return res.json({ message: 'Create link error' })
		}
	})
router.post('/delete-link',
	async (req, res) => {
		try {
			const { roomid, linkid } = req.body
			await chatRoomModel.updateOne({ _id: roomid }, { $pull: { links: { id: linkid } } })
			const room = await chatRoomModel.findOne({ _id: roomid })
			return res.status(200).json({ room })
		} catch (e) {
			return res.json({ message: 'Delete link error' })
		}
	})
router.post('/edit-link',
	async (req, res) => {
		try {
			const { roomid, linkid, linkname, link } = req.body
			const room = await chatRoomModel.findOne({ _id: roomid })
			room.links.forEach(forEachlink => {
				if (forEachlink.id === linkid) {
					forEachlink.linkname = linkname
					forEachlink.link = link
				}
			});
			await chatRoomModel.findOneAndUpdate({ _id: roomid }, { links: room.links })
			return res.status(200).json({ room })
		} catch (e) {
			return res.json({ message: 'Edit link error' })
		}
	})

module.exports = router;
