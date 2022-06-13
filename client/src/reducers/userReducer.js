const SET_CURRENT_USER = 'SET_CURRENT_USER'
const LOGOUT = 'LOGOUT'
const SET_USER = 'SET_USER'
const SET_USERS = 'SET_USERS'
const defaultState = {
	currentUser: {},
	isAuth: false,
	user: {},
	users: []
}

export default function userReducer(state = defaultState, action) {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				currentUser: action.payload,
				isAuth: true,
			}
		case LOGOUT:
			localStorage.removeItem('token')
			window.location.reload()
			return {
				...state,
				currentUser: {},
				isAuth: false,
			}
		case SET_USER:
			return {
				...state,
				user: action.payload
			}
		case SET_USERS:
			return {
				...state,
				users: action.payload
			}
		default:
			return state;
	}
}

export const setUserReducer = user => ({ type: SET_USER, payload: user })
export const setUsersReducer = users => ({ type: SET_USERS, payload: users })
export const setCurrentUserReducer = user => ({ type: SET_CURRENT_USER, payload: user })
export const logoutReducer = () => ({ type: LOGOUT })