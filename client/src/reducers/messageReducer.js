const ADD_MESSAGE = 'ADD_MESSAGE'
const LOAD_MESSAGES = 'LOAD_MESSAGES'
const SET_TOTAL = 'SET_TOTAL'
const CLEAR_MESSAGES = 'CLEAR_MESSAGES'
const UPDATE_MESSAGES = 'UPDATE_MESSAGES'
const GET_REPLY_MESSAGES = 'GET_REPLY_MESSAGES'
const CLEAR_REPLY_MESSAGES = 'CLEAR_REPLY_MESSAGES'

const defaultState = {
	messages: [],
	replyMessages: [],
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
		case UPDATE_MESSAGES:
			return {
				...state,
				messages: [...action.payload]
			}
		case GET_REPLY_MESSAGES:
			return {
				...state,
				replyMessages: [...action.payload]
			}
		case CLEAR_REPLY_MESSAGES:
			return {
				...state,
				replyMessages: []
			}
		case CLEAR_MESSAGES:
			return {
				...state,
				total: 0,
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

export const addMessageReducer = message => ({ type: ADD_MESSAGE, payload: message })
export const loadMessagesReducer = messages => ({ type: LOAD_MESSAGES, payload: messages })
export const setTotalReducer = total => ({ type: SET_TOTAL, payload: total })
export const clearMessagesReducer = () => ({ type: CLEAR_MESSAGES })
export const updateMessagesReducer = messages => ({ type: UPDATE_MESSAGES, payload: messages })
export const getReplyMessagesReducer = messages => ({ type: GET_REPLY_MESSAGES, payload: messages })
export const clearReplyMessagesReducer = () => ({ type: CLEAR_REPLY_MESSAGES })
