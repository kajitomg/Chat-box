const { Schema, model, ObjectId } = require('mongoose')


const userModel = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	avatar: { type: String },
	info: { type: Object },
	socketid: { type: String },
	rooms: [{ type: ObjectId, ref: 'chatRoomModel' }],
})

module.exports = model('users', userModel)