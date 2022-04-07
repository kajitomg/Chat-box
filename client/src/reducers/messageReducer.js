const ADD_MESSAGE = 'ADD_MESSAGE'
const LOAD_MESSAGES = 'LOAD_MESSAGES'
const SET_TOTAL = 'SET_TOTAL'
const CLEAR_MESSAGES = 'CLEAR_MESSAGES'

const defaultState = {
	messages: [],
	total: 0,
}

export default function messageReducer(state = defaultState, action) {
	switch (action.type) {
		case ADD_MESSAGE:
			return {
				...state,
				messages: [...state.messages, action.payload]
			}
		case LOAD_MESSAGES:
			return {
				...state,
				messages: [...action.payload, ...state.messages]
			}
		case CLEAR_MESSAGES:
			return {
				...state,
				messages: []
			}
		case SET_TOTAL:
			return {
				...state,
				total: action.payload
			}
		default:
			return state;
	}
}

export const addMessage = message => ({ type: ADD_MESSAGE, payload: message })
export const loadMessages = messages => ({ type: LOAD_MESSAGES, payload: messages })
export const setTotal = total => ({ type: SET_TOTAL, payload: total })
export const clearMessages = () => ({ type: CLEAR_MESSAGES })
