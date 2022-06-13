import { addMessageReducer, getReplyMessageReducer, getReplyMessagesReducer, loadMessagesReducer, setTotalReducer, updateMessagesReducer, uploadingMessagesReducer } from '../reducers/messageReducer'
import { gotoRoom } from '../reducers/roomReducer'
const axios = require('axios')
const api = require('../path/api_url')
const path = api.API_URL

export const getReplyMessagesAction = (messagesid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/message/get-reply-messages`, {
				messagesid
			})
			return await dispatch(getReplyMessagesReducer(response.data.messages))
		} catch (e) {
			console.log(e)
		}
	}
}
export const loadMessagesAction = (roomid, lastmessid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/message/load-messages`, {
				roomid,
				lastmessid
			})
			await dispatch(loadMessagesReducer(response.data.messages))
			return await dispatch(setTotalReducer(response.data.total))
		} catch (e) {
			console.log(e)
		}
	}
}
export const deleteMessageAction = (roomid, messageid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/room/delete-message`, {
				roomid,
				messageid
			})
			return
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const updateMessagesAction = (roomid, lastmessid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/message/load-messages`, {
				roomid,
				lastmessid
			})
			return await dispatch(updateMessagesReducer(response.data.messages))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}
export const editMessageAction = (roomid, messageid, message) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/message/edit-message`, {
				roomid,
				messageid,
				message
			})
			return
		} catch (e) {
			console.log(e.response.message)
		}
	}
}