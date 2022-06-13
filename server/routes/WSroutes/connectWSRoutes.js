const userModel = require("../../models/userModel")

const setWSConnection = (socket) => {
	socket.on('user-connection',
		async (data) => {
			const { userid } = data
			let user = userModel.findOne({ _id: userid })
			return await userModel.findOneAndUpdate({ _id: userid }, { info: { ...user.info, online: true }, socketid: socket.id })
		}
	)
}

module.exports = {
	setWSConnection: setWSConnection,
}