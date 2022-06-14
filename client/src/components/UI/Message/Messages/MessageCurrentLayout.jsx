import React from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../../../socket'
import avatarLogo from '../../../../img/avatar/default-avatar.jpg'

const MessageCurrentLayout = ({ messageBody, messageText, messageName,
	messageTime, messageMessage, messageTextPopup,
	messageContentPopup, messageAvatar, messageReplyContent,
	messageContent, messageReply, messageDelete,
	messageEdit, messageInteraction, setEditMessage,
	setReplyMessage, message, user,
	selectedMessage, setSelectedMessage, replyMess,
	roomid
}) => {

	const navigate = useNavigate()

	const api = require('../../../../path/api_url')
	const path = api.API_URL
	const avatarURL = user !== undefined ? user.avatar ? `${path + user.avatar}` : avatarLogo : avatarLogo

	const deleteRoom = async () => {
		await socket.emit('delete-message', { roomid: roomid, messageid: selectedMessage })
		await setSelectedMessage('');
	}

	return (
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
	)
}

export default MessageCurrentLayout