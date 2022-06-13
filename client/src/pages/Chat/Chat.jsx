import '../../styles/App.css'
import '../../styles/Chat/Chat.css'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getReplyMessagesAction, loadMessagesAction, updateMessagesAction } from '../../actions/message'
import { loadRoomsAction } from '../../actions/room'
import Message from '../../components/UI/Message/Message'
import MyButton from '../../components/UI/MyButton/MyButton'
import MyInput from '../../components/UI/MyInput/MyInput'
import Loader from '../../components/UI/Loader/Loader'
import { useFetching } from '../../hooks/useFetching'
import socket from '../../socket'
import { gotoRoomReducer } from '../../reducers/roomReducer'
import { addMessageReducer } from '../../reducers/messageReducer'
import { getUsersAction } from '../../actions/user'
import avatarLogo from '../../img/avatar/default-avatar.jpg'
import More from './More/More'

const Chat = () => {
	const location = useLocation()
	const roomid = location.pathname.split('/').reverse()[0]
	const chat = useSelector(state => state.room.room)
	const user = useSelector(state => state.user.currentUser)
	const users = useSelector(state => state.user.users)
	const totalCount = useSelector(state => state.message.total)
	const messages = useSelector(state => state.message.messages)
	const [selectedMessage, setSelectedMessage] = useState('')
	const navigate = useNavigate()
	const chatCase = ['chat__case']
	const chatWrapper = ['chat__wrapper']
	const chatBlur = ['chat__blur']
	const chatList = ['chat__list']
	const [moreInfo, setMoreInfo] = useState(false)
	const dispatch = useDispatch();
	const messsagesArea = useRef(null)
	const scrollEnd = useRef(null)
	const scrollTop = useRef(null)
	const [message, setMessage] = useState('')
	const [replyMessage, setReplyMessage] = useState('')
	const api = require('../../path/api_url')
	const path = api.API_URL

	useEffect(async () => {
		let tempMessages = []
		messages.forEach(async (mess) => {
			if (mess.inheritance) {
				tempMessages.push(mess.inheritance)
			}
		})
		await dispatch(getReplyMessagesAction(tempMessages))
		await scrollEnd.current.scrollIntoView()
	}, [messages])
	useEffect(async () => {
		socket.on('new-message', async (data) => {
			await dispatch(addMessageReducer(data.message))
			await scrollEnd.current.scrollIntoView()
		})
		socket.on('connect-to-room', async (data) => {
			await dispatch(gotoRoomReducer(data.room))
		})
		socket.on('edit-message', async (data) => {
			await dispatch(updateMessagesAction(roomid))
		})
		socket.on('delete-message', async (data) => {
			await dispatch(updateMessagesAction(roomid))
		})
		await fetchConnectToRoom()
		await dispatch(getUsersAction(roomid))
		await fetchMessages()
		await scrollEnd.current.scrollIntoView()
	}, [location])
	if (!moreInfo) {
		chatCase.push('active')
	}
	if (selectedMessage.length !== 0) {
		chatWrapper.push('selected')
		chatBlur.push('active')
	}
	if (replyMessage.length !== 0) {
		chatList.push('active')
	}

	const [fetchMessages, isMessagesLoading] = useFetching(async () => {
		if (messages.length === 0) {
			await dispatch(loadMessagesAction(roomid))
			return
		}
		await dispatch(loadMessagesAction(roomid, messages[0]._id))
		return

	})
	const [fetchConnectToRoom] = useFetching(async () => {
		await socket.emit('connect-to-room', { userid: user._id, roomid: roomid })
	})
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
			if (selectedMessage.length !== 0) {
				setMessage('')
				setSelectedMessage('')
				return await socket.emit('edit-message', { roomid: chat._id, messageid: selectedMessage, message: message })
			}
			if (replyMessage.length !== 0) {
				setMessage('')
				setReplyMessage('')
				return await socket.emit('new-message', { message: message, userid: user._id, roomid: chat._id, replyid: replyMessage })
			}
			setMessage('')
			return await socket.emit('new-message', { message: message, userid: user._id, roomid: chat._id })
		}
	}

	return (
		<section className='chat' onClick={() => {
			setSelectedMessage('');
			setMessage('')
		}}>
			{moreInfo
				&&
				<More chat={chat} user={user} users={users} moreInfo={moreInfo} setMoreInfo={setMoreInfo} />
			}
			{/* <RoomMain ref={scrollEnd} fetchMessages={fetchMessages} isMessagesLoading={isMessagesLoading} chatID={chatID} chat={chat} user={user} users={users} moreInfo={moreInfo} setMoreInfo={setMoreInfo} /> */}
			<div className={chatCase.join(' ')}>
				<div className='chat__back' onClick={() => {
					navigate('/chats/');
					dispatch(loadRoomsAction())
				}}>
					<span></span>
					<span></span>
				</div>
				<div className='chat__message-place'>
					<div className="chat__header">
						{chat._id !== undefined
							? <div className='chat__button-more chat__button-more-message-place' onClick={() => {
								setMoreInfo(!moreInfo)
							}}>
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
					<div className={chatWrapper.join(' ')}>

						<ul className={chatList.join(' ')} ref={messsagesArea} onScroll={scrollHadler} onClick={(e) => {
							e.stopPropagation()
						}}>
							<div className={chatBlur.join(' ')} onClick={() => {
								setSelectedMessage('');
								setMessage('')
							}}></div>
							<div className="top" ref={scrollTop}></div>
							{isMessagesLoading
								?
								<div className='chat__loader-container'><Loader /></div>
								:
								''
							}
							{messages.map((mess, i) =>
								users[0] !== undefined
									? i === 0
										?
										mess.user_id === user._id
											? <Message
												key={mess._id}
												name={true}
												roomid={roomid}
												user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
												message={mess}
												setEditMessage={setMessage}
												setReplyMessage={setReplyMessage}
												setSelectedMessage={setSelectedMessage}
												selectedMessage={selectedMessage}
												current={true} />
											: <Message
												key={mess._id}
												name={true}
												roomid={roomid}
												user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
												message={mess}
												setEditMessage={setMessage}
												setReplyMessage={setReplyMessage}
												setSelectedMessage={setSelectedMessage}
												selectedMessage={selectedMessage}
											/>
										:
										mess.user_id === messages[i - 1].user_id
											?
											mess.user_id === user._id
												? <Message
													key={mess._id}
													name={false}
													roomid={roomid}
													user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
													userid={mess.user_id}
													message={mess}
													setEditMessage={setMessage}
													setReplyMessage={setReplyMessage}
													setSelectedMessage={setSelectedMessage}
													selectedMessage={selectedMessage}
													current={true} />
												: <Message
													key={mess._id}
													name={false}
													roomid={roomid}
													user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
													message={mess}
													setEditMessage={setMessage}
													setReplyMessage={setReplyMessage}
													setSelectedMessage={setSelectedMessage}
													selectedMessage={selectedMessage}
												/>
											:
											mess.user_id === user._id
												? <Message
													key={mess._id}
													name={true}
													roomid={roomid}
													user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
													message={mess}
													setEditMessage={setMessage}
													setReplyMessage={setReplyMessage}
													setSelectedMessage={setSelectedMessage}
													selectedMessage={selectedMessage}
													current={true} />
												: <Message
													key={mess._id}
													name={true}
													roomid={roomid}
													user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
													message={mess}
													setEditMessage={setMessage}
													setReplyMessage={setReplyMessage}
													setSelectedMessage={setSelectedMessage}
													selectedMessage={selectedMessage}
												/>
									: ''
							)}<div className="end" ref={scrollEnd}></div>
							{messages.map((mess, i) =>
								mess._id === replyMessage
									?
									replyMessage.length !== 0
										?
										<div className='chat__reply reply' key={'reply' + mess._id}>
											<div className="reply__text">
												<div className="reply__info">
													<div className="reply__username">{mess.username}</div>
												</div>
												<div className="reply__message">{mess.mess}</div>
											</div>
											<div className="reply__close close">
												<div className="close__wrapper" onClick={() => {
													setReplyMessage('')
												}}>
													<span></span>
													<span></span>
												</div>
											</div>
										</div>
										: ''
									: ''
							)}
						</ul>
					</div>
					<form className='chat__form' action="" onClick={(e) => {
						e.stopPropagation()
					}}>
						<MyInput value={message} onChange={e => {
							setMessage(e.target.value)
						}} type='text' className='chat__input' placeholder='Write a message' />
						<MyButton onClick={sendMess} className='chat__button'>Send</MyButton>
					</form>
				</div>
				<div className='chat__info'>
					{chat._id !== undefined
						? <div className='chat__button-more chat__button-more-info' onClick={() => {
							setMoreInfo(!moreInfo)
						}}>
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
									<li key={user._id} className='chat__user' onClick={() => {
										navigate(`/Account/${user._id}`)
									}}>
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

		</section>





	)
}

export default Chat