const { Schema, model, ObjectId } = require('mongoose');

const messageModel = new Schema({
	user_id: { type: ObjectId, ref: 'userModel' },
	username: { type: String },
	time: { type: String },
	date: { type: Object },
	inheritance: { type: String },
	room_id: { type: ObjectId, ref: 'chatRoomModel' },
	mess: { type: String }

})

module.exports = model('messages', messageModel)