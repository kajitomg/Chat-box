import '../../../styles/App.css'
import '../../../styles/Room/Room.css'
import '../../../styles/Room/Chat/Chat.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getReplyMessagesAction, loadMessagesAction, updateMessagesAction } from '../../../actions/message'
import { loadRoomsAction } from '../../../actions/room'
import Loader from '../../../components/UI/Loader/Loader'
import Message from '../../../components/UI/Message/Message'
import MyButton from '../../../components/UI/MyButton/MyButton'
import MyInput from '../../../components/UI/MyInput/MyInput'
import { useFetching } from '../../../hooks/useFetching'
import socket from '../../../socket'
import avatarLogo from '../../../img/avatar/default-avatar.jpg'
import { addMessageReducer } from '../../../reducers/messageReducer'
import { gotoRoomReducer } from '../../../reducers/roomReducer'

const Chat = ({ setMoreInfo, moreInfo, location }) => {
	const roomid = location.pathname.split('/').reverse()[0]

	const chat = useSelector(state => state.room.room)
	const user = useSelector(state => state.user.currentUser)
	const users = useSelector(state => state.user.users)
	const totalCount = useSelector(state => state.message.total)
	const messages = useSelector(state => state.message.messages)

	const [selectedMessage, setSelectedMessage] = useState('')
	const [message, setMessage] = useState('')
	const [replyMessage, setReplyMessage] = useState('')

	const messsagesArea = useRef(null)
	const scrollEnd = useRef(null)
	const scrollTop = useRef(null)

	const navigate = useNavigate()
	const dispatch = useDispatch();

	const chatCase = ['chat__case']
	const chatWrapper = ['chat__wrapper']
	const chatBlur = ['chat__blur']
	const chatList = ['chat__list']

	const api = require('../../../path/api_url')
	const path = api.API_URL

	const loadCount = 15

	const [fetchMessages, isMessagesLoading] = useFetching(async () => {
		if (messages.length === 0) {
			return await dispatch(loadMessagesAction(roomid))
		}
		return await dispatch(loadMessagesAction(roomid, messages[0]._id))

	})
	const [fetchTempMessages, isTempMessagesLoading] = useFetching(async () => {
		let tempMessages = []
		messages.forEach(async (mess) => {
			if (mess.inheritance) {
				tempMessages.push(mess.inheritance)
			}
		})
		return await dispatch(getReplyMessagesAction(tempMessages))
	})

	useEffect(async () => {
		await fetchTempMessages()
		if (messages.length <= loadCount) {
			await messsagesArea.current.lastElementChild.scrollIntoView()
		}
	}, [messages])
	useEffect(() => {
		socket.on('new-message', async (data) => {
			await dispatch(addMessageReducer(data.message))
			await messsagesArea.current.lastElementChild.scrollIntoView()
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
	}, [])
	useEffect(async () => {
		await fetchTempMessages()
		await fetchMessages()
		await messsagesArea.current.lastElementChild.scrollIntoView()
	}, [location])

	const scrollHadler = async (e) => {
		if (e.target.scrollTop === 0) {
			if (messages.length === totalCount) {
				return
			}
			let lastHeight = e.target.scrollHeight
			await fetchTempMessages()
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

	return (
		<div className={chatCase.join(' ')}>
			<div className='chat__back' onClick={() => {
				navigate('/rooms/');
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
						{(isMessagesLoading || isTempMessagesLoading)
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
										? <Message				//MessageNameCurrentLayout
											key={mess._id}
											name={true}
											roomid={roomid}
											user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
											message={mess}
											setEditMessage={setMessage}
											setReplyMessage={setReplyMessage}
											setSelectedMessage={setSelectedMessage}
											selectedMessage={selectedMessage}
											current={true}
										/>
										: <Message				//MessageNameLayout
											key={mess._id}
											name={true}
											roomid={roomid}
											user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
											message={mess}
											setEditMessage={setMessage}
											setReplyMessage={setReplyMessage}
											setSelectedMessage={setSelectedMessage}
											selectedMessage={selectedMessage}
											current={false}
										/>
									:
									mess.user_id === messages[i - 1].user_id
										?
										mess.user_id === user._id
											? <Message				//MessageCurrentLayout
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
												current={true}
											/>
											: <Message				//MessageLayout
												key={mess._id}
												name={false}
												roomid={roomid}
												user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
												message={mess}
												setEditMessage={setMessage}
												setReplyMessage={setReplyMessage}
												setSelectedMessage={setSelectedMessage}
												selectedMessage={selectedMessage}
												current={false}
											/>
										:
										mess.user_id === user._id
											? <Message				//MessageNameCurrentLayout
												key={mess._id}
												name={true}
												roomid={roomid}
												user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
												message={mess}
												setEditMessage={setMessage}
												setReplyMessage={setReplyMessage}
												setSelectedMessage={setSelectedMessage}
												selectedMessage={selectedMessage}
												current={true}
											/>
											: <Message				//MessageNameLayout
												key={mess._id}
												name={true}
												roomid={roomid}
												user={users.filter(user => { if (user._id === mess.user_id) { return user } })[0]}
												message={mess}
												setEditMessage={setMessage}
												setReplyMessage={setReplyMessage}
												setSelectedMessage={setSelectedMessage}
												selectedMessage={selectedMessage}
												current={false}
											/>
								: ''
						)}
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
						<div className="end" ref={scrollEnd}></div>
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
	)
}

export default Chat