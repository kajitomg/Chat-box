import '../styles/Chats/Chats.css'
import '../styles/App.css'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createRoomAction, loadRoomsAction, searchRoomsAction } from '../actions/room'
import Loader from '../components/UI/Loader/Loader'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'
import MyModal from '../components/UI/MyModal/MyModal'
import { clearMessagesReducer, clearReplyMessagesReducer } from '../reducers/messageReducer'
import { clearRoomReducer } from '../reducers/roomReducer'
import avatarLogo from '../img/avatar/default-avatar.jpg'
import socket from '../socket'

const Chats = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const [roomName, setRoomName] = useState('')
	const dispatch = useDispatch()
	const [roomSearch, setRoomSearch] = useState('')
	const headers = { authorization: `Bearer ${localStorage.getItem('token')}` }
	const [isRoomLoading, setIsRoomLoading] = useState(false)
	const [roomsFounding, setRoomsFounding] = useState(false)
	const rooms = useSelector(state => state.room.rooms)
	const api = require('../path/api_url')
	const path = api.API_URL
	const avatarURL = avatarLogo
	const navigate = useNavigate()
	useEffect(async () => {
		socket.emit('clear-room')
		socket.removeListener('connect-to-room')
		socket.removeListener('new-message')
		await setIsRoomLoading(true)
		await dispatch(clearRoomReducer())
		await dispatch(clearMessagesReducer())
		await dispatch(clearReplyMessagesReducer())
		await dispatch(loadRoomsAction())
		await setIsRoomLoading(false)
	}, [])
	const createRoom = async (e) => {
		e.preventDefault()
		if (!roomName) {
			return
		}
		setIsRoomLoading(true)
		await dispatch(createRoomAction(roomName, headers))
		await setRoomName('')
		setModalVisible(false)
		setIsRoomLoading(false)
	}
	const serchRoom = async (e) => {
		e.preventDefault()
		if (!roomSearch) {
			return
		}
		setRoomsFounding(true)
		setIsRoomLoading(true)
		await dispatch(searchRoomsAction(roomSearch))
		await setRoomSearch('')
		setIsRoomLoading(false)

	}
	const canceledSearch = async () => {
		await setIsRoomLoading(true)
		await setRoomsFounding(false)
		await dispatch(loadRoomsAction())
		await setIsRoomLoading(false)
	}
	return (
		<section className='chats'>
			<form className='chats__search'>
				<MyInput value={roomSearch} onChange={async (e) => {
					setRoomSearch(e.target.value)
				}} type='text' className='chats__search-input' placeholder='Search rooms' />
				<MyButton className='chats__search-button' onClick={serchRoom}>Search</MyButton>
				{(roomsFounding && rooms.length !== 0 && !isRoomLoading)
					&&
					<div className="absence__cancel absence__cancel-foundroom" onClick={canceledSearch}>
						<span></span>
						<span></span>
					</div>
				}
			</form>
			<div className="chats__rooms">
				<MyModal visible={modalVisible} setVisible={setModalVisible} >
					<MyInput value={roomName} type='text' className='chats__input' placeholder='Chat name' onChange={(e) => {
						setRoomName(e.target.value)
					}
					} />
					<MyButton className='chats__button' onClick={createRoom} >Create room</MyButton>
				</MyModal>
				<div onClick={() => {
					setModalVisible(true)
				}} className="chats__room-create" >
					<span></span>
					<span></span>
				</div>
				{isRoomLoading
					? <div className='chats__loader'><Loader /></div>
					: rooms.length !== 0
						?
						rooms.map(room =>
							<div key={room.id} className="chats__room room" onClick={async () => {
								navigate(`/chat/${room.id}`);
							}}>

								<img className='room__avatar' src={room.avatar ? (path + room.avatar) : avatarURL} alt="" />
								<div className='room__roomname'>{room.roomname}<span className='room__id'>@{room.id.slice(0, 8)}</span></div>

							</div>
						)
						:
						roomsFounding
							?
							<div className='chats__absence absence'>
								<div className="absence__text">Комнаты не найдены</div>
								<div className="absence__cancel" onClick={canceledSearch}>
									<span></span>
									<span></span>
								</div>
							</div>
							:
							<div className='chats__absence absence'>
								<div className="absence__text absence__text-noroom">У вас еще нет ни одной комнаты</div>
							</div>
				}
			</div>
		</section>
	)
}

export default Chats