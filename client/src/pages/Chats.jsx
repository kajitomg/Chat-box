import '../styles/Chats.css'
import '../styles/App.css'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createroom, deleteroom, loadrooms, searchrooms } from '../actions/room'
import Loader from '../components/UI/Loader/Loader'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'
import MyModal from '../components/UI/MyModal/MyModal'
import { clearMessages } from '../reducers/messageReducer'
import { clearRoom } from '../reducers/roomReducer'
import socket from '../socket'

const Chats = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const [roomName, setRoomName] = useState('')
	const dispatch = useDispatch()
	const [roomSearch, setRoomSearch] = useState('')
	const headers = { authorization: `Bearer ${localStorage.getItem('token')}` }
	const [isRoomLoading, setIsRoomLoading] = useState(false)
	const rooms = useSelector(state => state.room.rooms)
	const user = useSelector(state => state.user.currentUser)
	const navigate = useNavigate()
	useEffect(async () => {
		socket.emit('clear-room')
		socket.removeListener('connect-to-room')
		socket.removeListener('new-message')
		await setIsRoomLoading(true)
		await dispatch(loadrooms())
		await setIsRoomLoading(false)
		dispatch(clearRoom())
		dispatch(clearMessages())
	}, [])
	const createRoom = async (e) => {
		e.preventDefault()
		if (!roomName) {
			return
		}
		setIsRoomLoading(true)
		await dispatch(createroom(roomName, headers))
		await setRoomName('')
		setModalVisible(false)
		setIsRoomLoading(false)
	}
	const serchRoom = async (e) => {
		e.preventDefault()
		if (!roomSearch) {
			return
		}
		setIsRoomLoading(true)
		await dispatch(searchrooms(roomSearch))
		await setRoomSearch('')
		setIsRoomLoading(false)

	}
	return (
		<div className='chats'>
			<form className='chats__search'>
				<MyInput value={roomSearch} onChange={async (e) => { setRoomSearch(e.target.value) }} type='text' className='chats__search-input' placeholder='Search rooms' />
				<MyButton className='chats__search-button' onClick={serchRoom}>Search</MyButton>
			</form>
			<div className="chats__rooms">
				<MyModal visible={modalVisible} setVisible={setModalVisible} >
					<MyInput value={roomName} type='text' className='chats__input' placeholder='Chat name' onChange={(e) => setRoomName(e.target.value)} />
					<MyButton className='chats__button' onClick={createRoom} >Создать комнату</MyButton>
				</MyModal>
				<div onClick={() => setModalVisible(true)} className="chats__room-create" >
					<span></span>
					<span></span>
				</div>
				{isRoomLoading
					? <div className='chats__loader'><Loader /></div>
					: rooms.map(room =>
						<div key={room.id} className="chats__room" onClick={async () => {
							navigate(`/chat/${room.id}`);
						}}>
							{room.roomname}
							<div className='chats__deleteroom' onClick={async (e) => { e.stopPropagation(); await dispatch(deleteroom(room.id, user.id)) }}>
								<span></span>
								<span></span>
							</div>
						</div>
					)
				}
			</div>
		</div >
	)
}

export default Chats