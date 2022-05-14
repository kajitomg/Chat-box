import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loadmessages } from '../actions/message';
import { getUsers } from '../actions/user';
import { useFetching } from '../hooks/useFetching';
import { addMessage } from '../reducers/messageReducer';
import { gotoRoom } from '../reducers/roomReducer';
import socket from '../socket'
import avatarLogo from '../img/avatar/default-avatar.jpg'
import Message from './UI/Message/Message';
import Loader from './UI/Loader/Loader';
import MyInput from './UI/MyInput/MyInput';
import MyButton from './UI/MyButton/MyButton';


const RoomMain = ({ ref, isMessagesLoading, fetchMessages, chatID, chat, user, users, setMoreInfo, moreInfo }) => {
	const totalCount = useSelector(state => state.message.total)
	const messages = useSelector(state => state.message.messages)
	const dispatch = useDispatch();
	const scrollEnd = useRef(null)
	const scrollTop = useRef(null)
	const [message, setMessage] = useState('')
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

		<div className='chat__case'>
			{/* <div className={chatMore.join(' ')}>
					<div className='more__button-close' onClick={() => setMoreInfo(!moreInfo)}>
						<span></span>
						<span></span>
					</div>
					<div className="more__info">
						<div className="more__room-avatar">

						</div>
						<div className="more__roomname">
							{chat.roomname}
						</div>
					</div>
					<div className='more__leave' onClick={async () => { leavetheroom(chat._id, user._id); navigate('/chats/'); dispatch(loadrooms()) }}>Leave room</div>
				</div> */}
			<div className='chat__message-place'>
				<div className="chat__header">
					<div className='chat__button-more chat__button-more-message-place' onClick={() => setMoreInfo(!moreInfo)}>
						<span></span>
						<span></span>
						<span></span>
					</div>
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
										? <Message key={mess._id} name={true} time={mess.time} username={mess.username} user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })} userid={mess.user_id} message={mess.mess} current={true} />
										: <Message key={mess._id} name={true} time={mess.time} username={mess.username} user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })} userid={mess.user_id} message={mess.mess} />
									:
									mess.user_id === messages[i - 1].user_id
										?
										mess.user_id === user._id
											? <Message key={mess._id} name={false} time={mess.time} username={mess.username} user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })} userid={mess.user_id} message={mess.mess} current={true} />
											: <Message key={mess._id} name={false} time={mess.time} username={mess.username} user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })} userid={mess.user_id} message={mess.mess} />
										:
										mess.user_id === user._id
											? <Message key={mess._id} name={true} time={mess.time} username={mess.username} user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })} userid={mess.user_id} message={mess.mess} current={true} />
											: <Message key={mess._id} name={true} time={mess.time} username={mess.username} user={users.filter(user => { if (user._id === mess.user_id) { return user.avatar } })} userid={mess.user_id} message={mess.mess} />
								: ''

						)}
						<div className="end" ref={ref}></div>
					</ul>
				</div>
				<form className='chat__form' action="">
					<MyInput value={message} onChange={e => setMessage(e.target.value)} type='text' className='chat__input' placeholder='Write a message' />
					<MyButton onClick={sendMess} className='chat__button'>Send</MyButton>
				</form>
			</div>
			<div className='chat__info'>
				<div className='chat__button-more chat__button-more-info' onClick={() => setMoreInfo(!moreInfo)}>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<div className='chat__users'>
					<ul >
						{(users[0] !== undefined)
							?
							users.map((user, i) =>
								<li key={user._id} className='chat__user' >
									{user.username}{<img className='chat__avatar' src={user.avatar ? `http://89.108.77.72:5000/${user.avatar}` : avatarLogo} alt="" />}
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

export default RoomMain