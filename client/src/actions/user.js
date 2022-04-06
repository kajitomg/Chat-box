import { setCurrentUser, setUser } from '../reducers/userReducer'

const axios = require('axios')
const path = 'http://elemen77.beget.tech:5000/'
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
			dispatch(setUser(response.data.user))
		} catch (e) {
			console.log(e.response.data.message)
		}
	}
}



