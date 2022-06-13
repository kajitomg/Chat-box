import { gotoRoomReducer } from '../../reducers/roomReducer'

const socket = require('../../socket')


export const connectToRoomSocket = (userid, roomid) => {
	return async dispatch => {
		socket.emit('connect-to-room', { userid, roomid })
		socket.on('connect-to-room', (data) => {
			console.log(data)
			dispatch(gotoRoomReducer(data.room))
		})
	}
}