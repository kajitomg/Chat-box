const ADD_ROOM = 'ADD_ROOM'
const LOAD__ROOMS = 'LOAD__ROOMS'
const GOTO__ROOM = 'GOTO__ROOM'
const defaultState = {
	rooms: [],
	room: {}
};


export default function roomReducer(state = defaultState, action) {
	switch (action.type) {
		case ADD_ROOM:
			return {
				...state,
				rooms: [...state.rooms, action.payload]
			}
		case LOAD__ROOMS:
			return {
				...state,
				rooms: [...action.payload]
			}
		case GOTO__ROOM:
			return {
				...state,
				room: action.payload
			}
		default:
			return state;
	}
}

export const addRoom = room => ({ type: ADD_ROOM, payload: room })
export const loadRooms = rooms => ({ type: LOAD__ROOMS, payload: rooms })
export const gotoRoom = room => ({ type: GOTO__ROOM, payload: room })