import { addRoom, gotoRoom, loadRooms } from '../reducers/roomReducer'
import { getUserReducer, setUser } from '../reducers/userReducer'

const axios = require('axios')
const path = 'http://89.108.77.72:5000/'
export const createroom = (roomname, headers) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/create-room`,
				{
					roomname,
					headers
				}
			)
			dispatch(addRoom(response.data.room))
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const deleteroom = (roomid, userid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/delete-room`,
				{
					roomid,
					userid
				}
			)
			dispatch(loadRooms(response.data.rooms))
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const leavetheroom = async (roomid, userid) => {
	try {
		const response = await axios.post(`${path}api/room/leave-room`,
			{
				roomid,
				userid
			}
		)
		return
	} catch (e) {
		console.log(e)
	}

}

export const loadrooms = () => {
	return async dispatch => {
		try {
			const response = await axios.get(`${path}api/room/load-rooms`,
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			)
			dispatch(loadRooms(response.data.rooms))
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const searchrooms = (name) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/search-rooms`, {
				name
			})
			dispatch(loadRooms(response.data.rooms))
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const connectToRoom = (userid, roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/connect-to-room`, {
				userid,
				roomid
			})
			/*dispatch(gotoRoom(response.data))*/
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const getConnectToRoom = () => {
	return async dispatch => {
		try {
			const response = await axios.get(`${path}api/room/get-connect-to-room`)
			dispatch(gotoRoom(response.data))
			return
		} catch (e) {
			console.log(e)
		}
	}
}

export const entrenceroom = async () => {
	try {
	} catch (e) {
		console.log(e)
	}
}
export const getRoomUser = (userid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/get-room-user`, {
				userid
			})
			dispatch(setUser(response.data))
			return
		} catch (e) {
			console.log(e)
		}
	}
}


export const getRoomUsers = async (usersid) => {
	try {
		const response = await axios.post(`${path}api/room/get-room-users`, {
			usersid
		})
		return console.log(response)
	} catch (e) {
		console.log(e)
	}
}
export const uploadRoomAvatar = (file, roomid) => {
	return async dispatch => {
		try {
			const formData = new FormData()
			formData.append('file', file)
			formData.append('data', roomid)
			const response = await axios.post(`${path}api/room/upload-avatar`, formData)
			await dispatch(gotoRoom(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const deleteRoomAvatar = (roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/delete-avatar`, {
				roomid
			})
			await dispatch(gotoRoom(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const editChatName = (roomid, roomname) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/edit-name`, {
				roomid,
				roomname
			})
			await dispatch(gotoRoom(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const editChatDescription = (roomid, roomdescription) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/edit-description`, {
				roomid,
				roomdescription
			})
			await dispatch(gotoRoom(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}

export const createLink = (linkname, linklink, roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/create-link`, {
				linkname,
				linklink,
				roomid,
			})
			await dispatch(gotoRoom(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const deleteLink = (linkid, roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/delete-link`, {
				linkid,
				roomid
			})
			await dispatch(gotoRoom(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const editLink = (linkname, linklink, roomid, linkid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/edit-link`, {
				linkname,
				linklink,
				roomid,
				linkid
			})
			await dispatch(gotoRoom(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}


