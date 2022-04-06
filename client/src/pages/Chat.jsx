import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMessage, loadmessages, sendMessage } from '../actions/message'
import { connectToRoom, getConnectToRoom, leavetheroom, loadrooms } from '../actions/room'
import Message from '../components/UI/Message/Message'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'
import '../styles/App.css'
import Loader from '../components/UI/Loader/Loader'
import { useFetching } from '../hooks/useFetching'
import { useSubscribing } from '../hooks/useSubscribing'

const Chat = () => {
	let location = useLocation()
	let chatID = location.pathname.split('/').reverse()[0]
	let chat = useSelector(state => state.room.room)
	let user = useSelector(state => state.user.currentUser)
	let totalCount = useSelector(state => state.message.total)
	let messages = useSelector(state => state.message.messages)
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const scrollEnd = useRef(null)
	const scrollTop = useRef(null)
	const [message, setMessage] = useState('')
	const [fetchMessages, isMessagesLoading, setIsMessagesLoading, messagesError] = useFetching(async () => {
		if (messages.length === 0) {
			await dispatch(loadmessages(chatID))
			await scrollEnd.current.scrollIntoView()
			return
		}
		dispatch(loadmessages(chatID, messages[0]._id))

	})
	const [fetchConnectToRoom, isConnectLoading, setIsConnectLoading, connectError] = useFetching(async () => {
		dispatch(connectToRoom(user.id, chatID))
	})
	useEffect(async () => {
		await fetchConnectToRoom()
		await fetchMessages()
		subscribeConnect()
		subscribeMessage()
	}, [location])
	const scrollHadler = async (e) => {
		if (e.target.scrollTop === 0) {
			if (messages.length === totalCount) {
				return
			}
			let lastHeight = e.target.scrollHeight
			await setIsMessagesLoading(true)
			await fetchMessages()
			await setIsMessagesLoading(false)
			let currentHeight = e.target.scrollHeight
			e.target.scrollTop = currentHeight - lastHeight
		}
	}
	const [subscribeConnect, errorConnect] = useSubscribing(async () => {
		await dispatch(getConnectToRoom())
		await subscribeConnect()
	})
	const [subscribeMessage, errorMessage] = useSubscribing(async () => {
		await dispatch(getMessage())
		await subscribeMessage()
	})
	const sendMess = async (e) => {
		e.preventDefault();
		if (message) {
			dispatch(sendMessage(message, user.id, chat.id))
			scrollEnd.current.scrollIntoView()
			setMessage('')
		}
	}
	return (
		<div className='chat'>
			<div className='chat__leave' onClick={async () => { leavetheroom(chat.id, user.id); navigate('/chats/'); dispatch(loadrooms()) }}>Leave</div>
			<div className='chat__message-place'>
				<div className="chat__header"></div>
				<ul className='chat__list' onScroll={scrollHadler}>
					<div className="top" ref={scrollTop}></div>
					{isMessagesLoading &&
						<div className='chat__loader-container'><Loader /></div>
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
				<form className='chat__form' action="">
					<MyInput value={message} onChange={e => setMessage(e.target.value)} type='text' className='chat__input' placeholder='Write a message' />
					<MyButton onClick={sendMess} className='chat__button'>Send</MyButton>
				</form>
			</div>
			<div className='chat__info'>
				<div className='chat__users'>
					<ul >
						{(chat.id != undefined) &&
							chat.usernames.map((username, i) =>
								<li key={chat.users[i]}>
									{username}
								</li>
							)}
					</ul>
				</div>
			</div>
		</div>





	)
}

export default Chat