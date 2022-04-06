const SET_CURRENT_USER = 'SET_CURRENT_USER'
const LOGOUT = 'LOGOUT'
const SET_USER = 'SET_USER'

const defaultState = {
	currentUser: {},
	isAuth: false,
	user: {},
	users: {}
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
		default:
			return state;
	}
}

export const setUser = user => ({ type: SET_USER, payload: user })
export const setCurrentUser = user => ({ type: SET_CURRENT_USER, payload: user })
export const logout = () => ({ type: LOGOUT })