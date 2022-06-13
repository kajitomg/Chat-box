const Router = require('express')
const config = require('config')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth.middleware.js')
const userModel = require('../models/userModel.js')


const router = new Router()

router.post('/registration',
	[
		check('username', 'Uncorrect username').isLength({ min: 1 }),

		check('password', 'Password must be longer than 3 and shorter then 12').isLength({ min: 3, max: 16 })
	],
	async (req, res) => {
		try {
			const { username, password } = req.body;
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Uncorrect request', errors })
			}
			const candidate = await userModel.findOne({ username });
			if (candidate) {
				return res.status(400).json({ next: 'next', message: `User with username ${username} was created` })
			}
			const hashpassword = await bcrypt.hash(password, 8)
			let user = new userModel({ username, password: hashpassword, rooms: [], avatar: null })
			await user.save()
			const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });
			user = await userModel.findOne({ username: username }, { password: 0, socketid: 0 })
			return res.json({
				token,
				user
			})

		} catch (e) {
			res.send({ message: 'Server error', error: e })
		}
	})


router.post('/login',
	async (req, res) => {
		try {
			const { username, password } = req.body
			let user = await userModel.findOne({ username })
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}
			const isPassValid = bcrypt.compareSync(password, user.password)
			if (!isPassValid) {
				return res.status(400).json({ message: 'Invalid password' })
			}
			const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });
			user = await userModel.findOne({ username: username }, { password: 0, socketid: 0 })
			return res.json({
				token,
				user
			})
		} catch (e) {
			console.log(e)
			res.send({ message: 'Server error' })
		}
	})

router.get('/auth', authMiddleware,
	async (req, res) => {
		try {
			const user = await userModel.findOne({ _id: req.user.id }, { password: 0, socketid: 0 })
			const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });
			return res.json({
				token,
				user
			})
		} catch (e) {
			console.log(e)
			res.send({ message: 'Server error' })
		}
	})

module.exports = router;