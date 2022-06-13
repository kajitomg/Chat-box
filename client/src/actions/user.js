import { setCurrentUserReducer, setUserReducer, setUsersReducer } from '../reducers/userReducer'

const axios = require('axios')
const api = require('../path/api_url')
const path = api.API_URL
export const registrationAction = (username, password) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/auth/registration`, {
				username,
				password
			})
			dispatch(setCurrentUserReducer(response.data.user))
			localStorage.setItem('token', response.data.token)
		} catch (e) {
			alert(e.response.data.message)
		}
	}
}

export const loginAction = (username, password) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/auth/login`, {
				username,
				password
			})
			dispatch(setCurrentUserReducer(response.data.user))
			localStorage.setItem('token', response.data.token)
		} catch (e) {
			alert(e.response.data.message)
		}
	}
}

export const authAction = () => {
	return async dispatch => {
		try {
			const response = await axios.get(`${path}api/auth/auth`,
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			)
			dispatch(setCurrentUserReducer(response.data.user))
			localStorage.setItem('token', response.data.token)
		} catch (e) {
			console.log(e.response.data.message)
			localStorage.removeItem('token')
		}
	}
}
export const getUserAction = (userid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/user/get-user`, {
				userid
			})
			return dispatch(setUserReducer(response.data.user))
		} catch (e) {
			console.log(e.response.data.message)
		}
	}
}
export const getUsersAction = (roomid) => {
	return async dispatch => {
		try {
			const response = await axios.post(`${path}api/user/get-users`, {
				roomid: roomid
			})
			return dispatch(setUsersReducer(response.data.users))
		} catch (e) {
			console.log(e.response.data.message)
		}
	}
}
export const uploadUserAvatarAction = (file, userid) => {
	return async dispatch => {
		try {
			const formData = new FormData()
			formData.append('file', file)
			const response = await axios.post(`${path}api/user/upload-avatar`, formData,
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			)
			await dispatch(setUserReducer(response.data.user))
			await dispatch(setCurrentUserReducer(response.data.user))
		} catch (e) {
			console.log(e.response.message)
		}
	}
}


