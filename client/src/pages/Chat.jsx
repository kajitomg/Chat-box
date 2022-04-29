import '../styles/App.css'
import '../styles/Chat.css'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadmessages } from '../actions/message'
import { leavetheroom, loadrooms } from '../actions/room'
import Message from '../components/UI/Message/Message'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'
import Loader from '../components/UI/Loader/Loader'
import { useFetching } from '../hooks/useFetching'
import socket from '../socket'
import { gotoRoom } from '../reducers/roomReducer'
import { addMessage } from '../reducers/messageReducer'

const Chat = () => {
	const location = useLocation()
	const chatID = location.pathname.split('/').reverse()[0]
	const chat = useSelector(state => state.room.room)
	const user = useSelector(state => state.user.currentUser)
	const totalCount = useSelector(state => state.message.total)
	const messages = useSelector(state => state.message.messages)
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const scrollEnd = useRef(null)
	const scrollTop = useRef(null)
	const [message, setMessage] = useState('')
	const [fetchMessages, isMessagesLoading] = useFetching(async () => {
		if (messages.length === 0) {
			await dispatch(loadmessages(chatID))
			await scrollEnd.current.scrollIntoView()
			return
		}
		await dispatch(loadmessages(chatID, messages[0]._id))

	})
	const [fetchConnectToRoom] = useFetching(() => {
		socket.emit('connect-to-room', { userid: user.id, roomid: chatID })
	})
	useEffect(async () => {
		fetchConnectToRoom()
		fetchMessages()
		socket.on('new-message', async (data) => {
			await dispatch(addMessage(data.message))
			await scrollEnd.current.scrollIntoView()
		})
		socket.on('connect-to-room', async (data) => {
			await dispatch(gotoRoom(data.room))
		})
	}, [location])
	const scrollHadler = async (e) => {
		if (e.target.scrollTop === 0) {
			if (messages.length === totalCount) {
				return
			}
			let lastHeight = e.target.scrollHeight
			await fetchMessages()
			let currentHeight = e.target.scrollHeight
			e.target.scrollTop = currentHeight - lastHeight
		}
	}
	const sendMess = async (e) => {
		e.preventDefault();
		if (message) {
			setMessage('')
			await socket.emit('new-message', { message: message, userid: user.id, roomid: chat._id })
		}
	}
	return (
		<div className='chat'>
			<div className='chat__leave' onClick={async () => { leavetheroom(chat._id, user.id); navigate('/chats/'); dispatch(loadrooms()) }}>Leave</div>
			<div className='chat__message-place'>
				<div className="chat__header"></div>
				<div className='chat__wrapper'>
					<ul className='chat__list' onScroll={scrollHadler}>
						<div className="top" ref={scrollTop}></div>
						{isMessagesLoading
							?
							<div className='chat__loader-container'><Loader /></div>
							:
							<div></div>
						}
						{messages.map((mess, i) =>
							i === 0
								?
								mess.user_id === user.id
									? <Message key={mess._id} name={true} time={mess.time} username={mess.username} message={mess.mess} current={true} />
									: <Message key={mess._id} name={true} time={mess.time} username={mess.username} message={mess.mess} />
								:
								mess.user_id === messages[i - 1].user_id
									?
									mess.user_id === user.id
										? <Message key={mess._id} name={false} time={mess.time} username={mess.username} message={mess.mess} current={true} />
										: <Message key={mess._id} name={false} time={mess.time} username={mess.username} message={mess.mess} />
									:
									mess.user_id === user.id
										? <Message key={mess._id} name={true} time={mess.time} username={mess.username} message={mess.mess} current={true} />
										: <Message key={mess._id} name={true} time={mess.time} username={mess.username} message={mess.mess} />
						)}
						<div className="end" ref={scrollEnd}></div>
					</ul>
				</div>
				<form className='chat__form' action="">
					<MyInput value={message} onChange={e => setMessage(e.target.value)} type='text' className='chat__input' placeholder='Write a message' />
					<MyButton onClick={sendMess} className='chat__button'>Send</MyButton>
				</form>
			</div>
			<div className='chat__info'>
				<div className='chat__users'>
					<ul >
						{(chat._id !== undefined)
							?
							chat.usernames.map((username, i) =>
								<li key={chat.users[i]}>
									{username}
								</li>
							)
							:
							<div className='chat__loader-container'><Loader /></div>
						}
					</ul>
				</div>
			</div>
		</div>





	)
}

export default Chat