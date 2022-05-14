import { addMessage, loadMessages, setTotal, uploadingMessages } from '../reducers/messageReducer'
import { gotoRoom } from '../reducers/roomReducer'
const axios = require('axios')
const path = 'http://chat-box:5000/'
export const sendMessage = (message, userid, roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/message/send-message`, {
				message,
				userid,
				roomid
			})
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const getMessage = () => {
	return async dispatch => {
		try {
			const response = await axios.get(`${path}api/message/get-message`)
			await dispatch(addMessage(response.data.message))
			return
		} catch (e) {
			console.log(e)
		}
	}
}
export const loadmessages = (roomid, lastmessid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/message/load-messages`, {
				roomid,
				lastmessid
			})
			await dispatch(loadMessages(response.data.messages))
			await dispatch(setTotal(response.data.total))
			return
		} catch (e) {
			console.log(e)
		}
	}
}