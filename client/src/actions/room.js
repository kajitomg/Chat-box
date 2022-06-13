import { loadMessagesReducer } from '../reducers/messageReducer'
import { addRoomReducer, gotoRoomReducer, loadRoomsReducer } from '../reducers/roomReducer'
import { getUserReducer, setUserReducer } from '../reducers/userReducer'

const axios = require('axios')
const api = require('../path/api_url')
const path = api.API_URL
export const createRoomAction = (roomname, headers) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/create-room`,
				{
					roomname,
					headers
				}
			)
			return dispatch(addRoomReducer(response.data.room))
		} catch (e) {
			console.log(e)
		}
	}
}
export const deleteRoomAction = (roomid, userid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/delete-room`,
				{
					roomid,
					userid
				}
			)
			return dispatch(loadRoomsReducer(response.data.rooms))
		} catch (e) {
			console.log(e)
		}
	}
}
export const leaveRoomAction = async (roomid, userid) => {
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

export const loadRoomsAction = () => {
	return async dispatch => {
		try {
			const response = await axios.get(`${path}api/room/load-rooms`,
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			)
			return dispatch(loadRoomsReducer(response.data.rooms))
		} catch (e) {
			console.log(e)
		}
	}
}
export const searchRoomsAction = (roomname) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/search-rooms`, {
				roomname
			})
			return dispatch(loadRoomsReducer(response.data.rooms))
		} catch (e) {
			console.log(e)
		}
	}
}
export const connectToRoomAction = (userid, roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/connect-to-room`, {
				userid,
				roomid
			})
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const getConnectToRoomAction = () => {
	return async dispatch => {
		try {
			const response = await axios.get(`${path}api/room/get-connect-to-room`)
			return dispatch(gotoRoomReducer(response.data))
		} catch (e) {
			console.log(e)
		}
	}
}

export const getRoomUserAction = (userid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/get-room-user`, {
				userid
			})
			return dispatch(setUserReducer(response.data))
		} catch (e) {
			console.log(e)
		}
	}
}


export const getRoomUsersAction = async (usersid) => {
	try {
		const response = await axios.post(`${path}api/room/get-room-users`, {
			usersid
		})
		return
	} catch (e) {
		console.log(e)
	}
}
export const uploadRoomAvatarAction = (file, roomid) => {
	return async dispatch => {
		try {
			const formData = new FormData()
			formData.append('file', file)
			formData.append('data', roomid)
			const response = await axios.post(`${path}api/room/upload-avatar`, formData)
			return await dispatch(gotoRoomReducer(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const deleteRoomAvatarAction = (roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/delete-avatar`, {
				roomid
			})
			return await dispatch(gotoRoomReducer(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const editChatNameAction = (roomid, roomname) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/edit-name`, {
				roomid,
				roomname
			})
			return await dispatch(gotoRoomReducer(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const editChatDescriptionAction = (roomid, roomdescription) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/edit-description`, {
				roomid,
				roomdescription
			})
			return await dispatch(gotoRoomReducer(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}

export const createLinkAction = (linkname, link, roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/create-link`, {
				linkname,
				link,
				roomid,
			})
			return await dispatch(gotoRoomReducer(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const deleteLinkAction = (linkid, roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/delete-link`, {
				linkid,
				roomid
			})
			return await dispatch(gotoRoomReducer(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const editLinkAction = (linkname, link, roomid, linkid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/edit-link`, {
				linkname,
				link,
				roomid,
				linkid
			})
			return await dispatch(gotoRoomReducer(response.data.room))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}


