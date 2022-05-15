import { setCurrentUser, setUser, setUsers } from '../reducers/userReducer'

const axios = require('axios')
const api = require('../path/api_url')
const path = api.API_URL
export const registration = (username, password) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/auth/registration`, {
				username,
				password
			})
			dispatch(setCurrentUser(response.data.user))
			localStorage.setItem('token', response.data.token)
		} catch (e) {
			alert(e.response.data.message)
		}
	}
}

export const login = (username, password) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/auth/login`, {
				username,
				password
			})
			dispatch(setCurrentUser(response.data.user))
			localStorage.setItem('token', response.data.token)
		} catch (e) {
			alert(e.response.data.message)
		}
	}
}

export const auth = () => {
	return async dispatch => {
		try {
			const response = await axios.get(`${path}api/auth/auth`,
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			)
			dispatch(setCurrentUser(response.data.user))
			localStorage.setItem('token', response.data.token)
		} catch (e) {
			console.log(e.response.data.message)
			localStorage.removeItem('token')
		}
	}
}
export const getUser = (userID) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/user/get-user`, {
				userID
			})
			return dispatch(setUser(response.data.user))
		} catch (e) {
			console.log(e.response.data.message)
		}
	}
}
export const getUsers = (chatID) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/user/get-users`, {
				roomid: chatID
			})
			return dispatch(setUsers(response.data.users))
		} catch (e) {
			console.log(e.response.data.message)
		}
	}
}
export const uploadUserAvatar = (file, userID) => {
	return async dispatch => {
		try {
			const formData = new FormData()
			formData.append('file', file)
			const response = await axios.post(`${path}api/user/upload-avatar`, formData,
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			)
			await dispatch(setUser(response.data.user))
			await dispatch(setCurrentUser(response.data.user))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}


