import React, { useEffect, useState } from 'react'
import cl from './Message.module.css'
import avatarLogo from '../../../img/avatar/default-avatar.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAction } from '../../../actions/user'
import { useNavigate } from 'react-router-dom'
import { deleteMessageAction } from '../../../actions/room'
import { getReplyMessageAction, loadMessagesAction, updateMessagesAction } from '../../../actions/message'
import socket from '../../../socket'

const Message = ({ roomid, name, setEditMessage, setReplyMessage, message, user, current, selectedMessage, setSelectedMessage }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const replyMessages = useSelector(state => state.message.replyMessages)
	const messageBody = [cl.messageBody]
	const messageText = [cl.messageText]
	const messageName = [cl.messageName]
	const messageTime = [cl.messageTime]
	const messageMessage = [cl.messageMessage]
	const messageTextPopup = [cl.messageTextPopup, cl.name]
	const messageContentPopup = [cl.messageContentPopup, cl.name]
	const messageAvatar = [cl.messageAvatar]
	const messageReplyContent = [cl.messageReplyContent]
	const messageContent = [cl.messageContent]
	const messageReply = [cl.messageReply, cl.messageEditButton]
	const messageDelete = [cl.messageDelete, cl.messageEditButton]
	const messageEdit = [cl.messageEdit, cl.messageEditButton]
	const messageInteraction = [cl.messageInteraction]
	const api = require('../../../path/api_url')
	const path = api.API_URL
	const avatarURL = user !== undefined ? user.avatar ? `${path + user.avatar}` : avatarLogo : avatarLogo
	useEffect(async () => {
		socket.on('delete-message', async (data) => {
			await dispatch(updateMessagesAction(roomid))
		})
	}, [])
	if (current) {
		messageBody.push(cl.currentUser)
		messageText.push(cl.currentUser)
		messageTextPopup.push(cl.currentUser)
		messageContentPopup.push(cl.currentUser)
		messageName.push(cl.currentUser)
		messageTime.push(cl.currentUser)
		messageMessage.push(cl.currentUser)
		messageAvatar.push(cl.currentUser)
		messageContent.push(cl.currentUser)
		messageInteraction.push(cl.currentUser)
	}
	if (name) {
		messageBody.push(cl.name)
		messageText.push(cl.name)
		messageAvatar.push(cl.name)
		messageContent.push(cl.name)
	}
	if (selectedMessage === message._id) {
		messageBody.push(cl.selected)
		messageText.push(cl.selected)
		messageTextPopup.push(cl.selected)
		messageContentPopup.push(cl.selected)
		messageName.push(cl.selected)
		messageTime.push(cl.selected)
		messageMessage.push(cl.selected)
		messageAvatar.push(cl.selected)
		messageContent.push(cl.selected)
		messageInteraction.push(cl.selected)
	}
	const deleteRoom = async () => {
		await socket.emit('delete-message', { roomid: roomid, messageid: selectedMessage })
		await setSelectedMessage('');
	}
	return (
		<div className={cl.messageWrapper}>
			{name
				?
				current
					?
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								? <li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)} key={'reply' + replyMess._id}>
									<span className={messageText.join(' ')}>
										<span className={messageContent.join(' ')} >
											<span className={messageName.join(' ')}>{message.username}</span>
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
										<span className={messageAvatar.join(' ')}><img src={avatarURL} alt="" /></span>
									</span>
									<span className={messageTextPopup.join(' ')}>
										<span className={messageContentPopup.join(' ')} >
											<span className={messageName.join(' ')} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>{message.username}</span>
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
										<span className={messageAvatar.join(' ')} onClick={() =>
											navigate(`/Account/${user._id}`)
										}><img src={avatarURL} alt="" /></span>
									</span>
									<span className={messageInteraction.join(' ')}>
										<span className={messageDelete.join(' ')} onClick={deleteRoom}>Delete</span>
										<span className={messageEdit.join(' ')} onClick={() => {
											setEditMessage(message.mess)
										}}>Edit</span>
										<span className={messageReply.join(' ')} onClick={async () => {
											await setReplyMessage(selectedMessage);
											await setEditMessage('')
											await setSelectedMessage('');
										}}>Reply</span>
									</span>
								</li>
								: ''

						)
						:
						<li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)} >
							<span className={messageText.join(' ')}>
								<span className={messageContent.join(' ')} >
									<span className={messageName.join(' ')}>{message.username}</span>
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
								<span className={messageAvatar.join(' ')}><img src={avatarURL} alt="" /></span>
							</span>
							<span className={messageTextPopup.join(' ')}>
								<span className={messageContentPopup.join(' ')} >
									<span className={messageName.join(' ')} onClick={() =>
										navigate(`/Account/${user._id}`)
									}>{message.username}</span>
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
								<span className={messageAvatar.join(' ')} onClick={() =>
									navigate(`/Account/${user._id}`)
								}><img src={avatarURL} alt="" /></span>
							</span>
							<span className={messageInteraction.join(' ')}>
								<span className={messageDelete.join(' ')} onClick={deleteRoom}>Delete</span>
								<span className={messageEdit.join(' ')} onClick={() => {
									setEditMessage(message.mess)
								}}>Edit</span>
								<span className={messageReply.join(' ')} onClick={async () => {
									await setReplyMessage(selectedMessage);
									await setEditMessage('')
									await setSelectedMessage('');
								}}>Reply</span>
							</span>
						</li>
					:
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								?
								<li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)} key={'reply' + replyMess._id}>
									<span className={messageText.join(' ')}>
										<span className={messageAvatar.join(' ')}><img src={avatarURL} alt="" /></span>
										<span className={messageContent.join(' ')} >
											<span className={messageName.join(' ')}>{message.username}</span>
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
									</span>
									<span className={messageTextPopup.join(' ')}>
										<span className={messageAvatar.join(' ')} onClick={() =>
											navigate(`/Account/${user._id}`)
										}><img src={avatarURL} alt="" /></span>
										<span className={messageContentPopup.join(' ')} >
											<span className={messageName.join(' ')} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>{message.username}</span>
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
									</span>
									<span className={messageInteraction.join(' ')}>
										<span className={messageReply.join(' ')} onClick={async () => {
											await setReplyMessage(selectedMessage);
											await setEditMessage('')
											await setSelectedMessage('');
										}}>Reply</span>
									</span>
								</li>
								: ''
						)
						:
						<li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)}>
							<span className={messageText.join(' ')}>
								<span className={messageAvatar.join(' ')}><img src={avatarURL} alt="" /></span>
								<span className={messageContent.join(' ')} >
									<span className={messageName.join(' ')}>{message.username}</span>
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
							</span>
							<span className={messageTextPopup.join(' ')}>
								<span className={messageAvatar.join(' ')} onClick={() =>
									navigate(`/Account/${user._id}`)
								}><img src={avatarURL} alt="" /></span>
								<span className={messageContentPopup.join(' ')} >
									<span className={messageName.join(' ')} onClick={() =>
										navigate(`/Account/${user._id}`)
									}>{message.username}</span>
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
							</span>
							<span className={messageInteraction.join(' ')}>
								<span className={messageReply.join(' ')} onClick={async () => {
									await setReplyMessage(selectedMessage);
									await setEditMessage('')
									await setSelectedMessage('');
								}}>Reply</span>
							</span>
						</li>
				:
				current
					?
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								?
								<li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)} key={'reply' + replyMess._id}>
									<span className={messageText.join(' ')}>
										<span className={messageContent.join(' ')} >
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
									</span>
									<span className={messageTextPopup.join(' ')}>
										<span className={messageContentPopup.join(' ')} >
											<span className={messageName.join(' ')} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>{message.username}</span>
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
										<span className={messageAvatar.join(' ')} onClick={() =>
											navigate(`/Account/${user._id}`)
										}><img src={avatarURL} alt="" /></span>
									</span>
									<span className={messageInteraction.join(' ')}>
										<span className={messageDelete.join(' ')} onClick={deleteRoom}>Delete</span>
										<span className={messageEdit.join(' ')} onClick={() => {
											setEditMessage(message.mess)
										}}>Edit</span>
										<span className={messageReply.join(' ')} onClick={async () => {
											await setReplyMessage(selectedMessage);
											await setEditMessage('')
											await setSelectedMessage('');
										}}>Reply</span>
									</span>
								</li>
								: ''
						)
						:
						<li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)}>
							<span className={messageText.join(' ')}>
								<span className={messageContent.join(' ')} >
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
							</span>
							<span className={messageTextPopup.join(' ')}>
								<span className={messageContentPopup.join(' ')} >
									<span className={messageName.join(' ')} onClick={() =>
										navigate(`/Account/${user._id}`)
									}>{message.username}</span>
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
								<span className={messageAvatar.join(' ')} onClick={() =>
									navigate(`/Account/${user._id}`)
								}><img src={avatarURL} alt="" /></span>
							</span>
							<span className={messageInteraction.join(' ')}>
								<span className={messageDelete.join(' ')} onClick={deleteRoom}>Delete</span>
								<span className={messageEdit.join(' ')} onClick={() => {
									setEditMessage(message.mess)
								}}>Edit</span>
								<span className={messageReply.join(' ')} onClick={async () => {
									await setReplyMessage(selectedMessage);
									await setEditMessage('')
									await setSelectedMessage('');
								}}>Reply</span>
							</span>
						</li>
					:
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								?
								<li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)} key={'reply' + replyMess._id}>
									<span className={messageText.join(' ')}>
										<span className={messageContent.join(' ')} >
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
									</span>
									<span className={messageTextPopup.join(' ')}>
										<span className={messageAvatar.join(' ')} onClick={() =>
											navigate(`/Account/${user._id}`)
										}><img src={avatarURL} alt="" /></span>
										<span className={messageContentPopup.join(' ')} >
											<span className={messageName.join(' ')} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>{message.username}</span>
											<span className={messageReplyContent.join(' ')}>
												<span className={messageName.join(' ')}>{replyMess.username}</span>
												<span className={messageMessage.join(' ')}>{replyMess.mess}</span>
												<span className={messageTime.join(' ')}>{replyMess.time}</span>
											</span>
											<span className={messageMessage.join(' ')}>{message.mess}</span>
											<span className={messageTime.join(' ')}>{message.time}</span>
										</span>
									</span>
									<span className={messageInteraction.join(' ')}>
										<span className={messageReply.join(' ')} onClick={async () => {
											await setReplyMessage(selectedMessage);
											await setEditMessage('')
											await setSelectedMessage('');
										}}>Reply</span>
									</span>
								</li>
								: ''
						)
						:
						<li className={messageBody.join(' ')} onClick={() => setSelectedMessage(message._id)}>
							<span className={messageText.join(' ')}>
								<span className={messageContent.join(' ')} >
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
							</span>
							<span className={messageTextPopup.join(' ')}>
								<span className={messageAvatar.join(' ')} onClick={() =>
									navigate(`/Account/${user._id}`)
								}><img src={avatarURL} alt="" /></span>
								<span className={messageContentPopup.join(' ')} >
									<span className={messageName.join(' ')} onClick={() =>
										navigate(`/Account/${user._id}`)
									}>{message.username}</span>
									<span className={messageMessage.join(' ')}>{message.mess}</span>
									<span className={messageTime.join(' ')}>{message.time}</span>
								</span>
							</span>
							<span className={messageInteraction.join(' ')}>
								<span className={messageReply.join(' ')} onClick={async () => {
									await setReplyMessage(selectedMessage);
									await setEditMessage('')
									await setSelectedMessage('');
								}}>Reply</span>
							</span>
						</li>
			}
		</div >
	)
}

export default Message