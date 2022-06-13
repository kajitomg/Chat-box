const userModel = require("../../models/userModel")

const breakWSConnection = (socket) => {
	socket.on('disconnect',
		async () => {
			let user = await userModel.findOne({ socketid: socket.id })
			if (!user) {
				return
			}
			return await userModel.findOneAndUpdate({ socketid: socket.id }, { info: { ...user.info, online: false }, socketid: null })
		})
}

module.exports = {
	breakWSConnection: breakWSConnection,
}