import '../styles/App.css'
import '../styles/Chat.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadmessages } from '../actions/message'
import { leavetheroom, loadrooms } from '../actions/room'
import Message from '../components/UI/Message/Message'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'
import Loader from '../components/UI/Loader/Loader'
import MoreButton from '../components/UI/MoreButton/MoreButton'
import { useFetching } from '../hooks/useFetching'
import socket from '../socket'
import { gotoRoom } from '../reducers/roomReducer'
import { addMessage } from '../reducers/messageReducer'
import { getUsers } from '../actions/user'
import avatarLogo from '../img/avatar/default-avatar.jpg'
import More from '../components/More'
import RoomMain from '../components/RoomMain'

const Chat = () => {
	const location = useLocation()
	const chatID = location.pathname.split('/').reverse()[0]
	const chat = useSelector(state => state.room.room)
	const user = useSelector(state => state.user.currentUser)
	const users = useSelector(state => state.user.users)
	const totalCount = useSelector(state => state.message.total)
	const messages = useSelector(state => state.message.messages)
	const navigate = useNavigate()
	const chatMore = ['chat__more', 'more']
	const chatCase = ['chat__case']
	const [moreInfo, setMoreInfo] = useState(false)
	const dispatch = useDispatch();
	const scrollEnd = useRef(null)
	const scrollTop = useRef(null)
	const [message, setMessage] = useState('')
	const api = require('../path/api_url')
	const path = api.API_URL
	const [fetchMessages, isMessagesLoading] = useFetching(async () => {
		if (messages.length === 0) {
			await dispatch(loadmessages(chatID))
			setTimeout(() => {

				scrollEnd.current.scrollIntoView()
			}, 100)
			return
		}
		await dispatch(loadmessages(chatID, messages[0]._id))

	})
	if (!moreInfo) {
		chatCase.push('active')
	}
	if (moreInfo) {
		chatCase.slice(-1, 1)
	}
	const [fetchConnectToRoom] = useFetching(async () => {
		await socket.emit('connect-to-room', { userid: user._id, roomid: chatID })
	})
	useEffect(async () => {
		fetchConnectToRoom()
		dispatch(getUsers(chatID))
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
			await socket.emit('new-message', { message: message, userid: user._id, roomid: chat._id })
		}
	}
	return (
		<div className='chat'>
			{moreInfo
				&&
				<More chat={chat} user={user} users={users} moreInfo={moreInfo} setMoreInfo={setMoreInfo} />
			}
			{/* <RoomMain ref={scrollEnd} fetchMessages={fetchMessages} isMessagesLoading={isMessagesLoading} chatID={chatID} chat={chat} user={user} users={users} moreInfo={moreInfo} setMoreInfo={setMoreInfo} /> */}
			<div className={chatCase.join(' ')}>
				<div className='chat__back' onClick={() => {
					navigate('/chats/');
					dispatch(loadrooms())
				}}>
					<span></span>
					<span></span>
				</div>
				<div className='chat__message-place'>
					<div className="chat__header">
						{chat._id !== undefined
							? <div className='chat__button-more chat__button-more-message-place' onClick={() =>
								setMoreInfo(!moreInfo)
							}>
								<span></span>
								<span></span>
								<span></span>
							</div>
							: <div className='chat__button-more chat__button-more-message-place'>
								<span></span>
								<span></span>
								<span></span>
							</div>
						}
					</div>
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
								users[0] !== undefined
									? i === 0
										?
										mess.user_id === user._id
											? <Message
												key={mess._id}
												name={true}
												time={mess.time}
												username={mess.username}
												user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })}
												userid={mess.user_id}
												message={mess.mess}
												current={true} />
											: <Message
												key={mess._id}
												name={true}
												time={mess.time}
												username={mess.username}
												user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })}
												userid={mess.user_id}
												message={mess.mess} />
										:
										mess.user_id === messages[i - 1].user_id
											?
											mess.user_id === user._id
												? <Message
													key={mess._id}
													name={false}
													time={mess.time}
													username={mess.username}
													user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })}
													userid={mess.user_id}
													message={mess.mess}
													current={true} />
												: <Message
													key={mess._id}
													name={false}
													time={mess.time}
													username={mess.username}
													user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })}
													userid={mess.user_id}
													message={mess.mess} />
											:
											mess.user_id === user._id
												? <Message
													key={mess._id}
													name={true}
													time={mess.time}
													username={mess.username}
													user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })}
													userid={mess.user_id}
													message={mess.mess}
													current={true} />
												: <Message
													key={mess._id}
													name={true}
													time={mess.time}
													username={mess.username}
													user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })}
													userid={mess.user_id}
													message={mess.mess} />
									: ''
							)}
							<div className="end" ref={scrollEnd}></div>
						</ul>
					</div>
					<form className='chat__form' action="">
						<MyInput value={message} onChange={e =>
							setMessage(e.target.value)
						} type='text' className='chat__input' placeholder='Write a message' />
						<MyButton onClick={sendMess} className='chat__button'>Send</MyButton>
					</form>
				</div>
				<div className='chat__info'>
					{chat._id !== undefined
						? <div className='chat__button-more chat__button-more-info' onClick={() =>
							setMoreInfo(!moreInfo)
						}>
							<span></span>
							<span></span>
							<span></span>
						</div>
						:
						<div className='chat__button-more chat__button-more-info'>
							<span></span>
							<span></span>
							<span></span>
						</div>
					}
					<div className='chat__users'>
						<ul >
							{(users[0] !== undefined)
								?
								users.map((user, i) =>
									<li key={user._id} className='chat__user' >
										{<img className='chat__avatar' src={user.avatar ? `${path + user.avatar}` : avatarLogo} alt="" />}{user.username}
									</li>
								)
								:
								<div className='chat__loader-container'><Loader /></div>
							}
						</ul>
					</div>
				</div>
			</div>

		</div >





	)
}

export default Chat