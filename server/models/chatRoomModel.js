const { Schema, model, ObjectId } = require('mongoose');

const chatRoomModel = new Schema({
	users: [{ type: ObjectId, ref: 'userModel' }],
	usernames: [{ type: String }],
	roomname: { type: String, required: true },
	roomname_lower: { type: String, required: true },
	role: [{ type: Object }],
	messages: [{ type: Object, ref: 'messageModel' }],
	description: { type: String },
	links: [{ type: Object }],
	avatar: { type: String }

})

module.exports = model('chat-rooms', chatRoomModel)