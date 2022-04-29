const { Schema, model, ObjectId } = require('mongoose')


const User = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	avatar: { type: String },
	info: { type: Object },
	socketid: { type: String },
	rooms: [{ type: ObjectId, ref: 'Chat-room' }],
})

module.exports = model('User', User)