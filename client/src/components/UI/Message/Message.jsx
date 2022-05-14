import React, { useEffect } from 'react'
import cl from './Message.module.css'
import avatarLogo from '../../../img/avatar/default-avatar.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../../actions/user'

const Message = ({ name, time, message, username, user, userid, current }) => {
	const messageBody = [cl.messageBody]
	const messageText = [cl.messageText]
	const messageName = [cl.messageName]
	const messageTime = [cl.messageTime]
	const messageMessage = [cl.messageMessage]
	const messageAvatar = [cl.messageAvatar]
	const messageContent = [cl.messageContent]
	const avatarURL = user[0] !== undefined ? user[0].avatar ? `http://localhost:5000/${user[0].avatar}` : avatarLogo : avatarLogo
	if (current) {
		messageBody.push(cl.currentUser)
		messageText.push(cl.currentUser)
		messageName.push(cl.currentUser)
		messageTime.push(cl.currentUser)
		messageMessage.push(cl.currentUser)
		messageAvatar.push(cl.currentUser)
		messageContent.push(cl.currentUser)
	}
	if (name) {
		messageBody.push(cl.name)
		messageText.push(cl.name)
		messageAvatar.push(cl.name)
		messageContent.push(cl.name)
	}
	return (
		<div className={cl.messageWrapper}>
			{name
				?
				current
					?
					<li className={messageBody.join(' ')}>
						<span className={messageText.join(' ')}>
							<span className={messageContent.join(' ')} >
								<span className={messageName.join(' ')}>{username}</span>
								<span className={messageMessage.join(' ')}>{message}</span>
								<span className={messageTime.join(' ')}>{time}</span>
							</span>
							<span className={messageAvatar.join(' ')}><img src={avatarURL} alt="" /></span>
						</span>
					</li>
					:
					<li className={messageBody.join(' ')}>
						<span className={messageText.join(' ')}>
							<span className={messageAvatar.join(' ')}><img src={avatarURL} alt="" /></span>
							<span className={messageContent.join(' ')} >
								<span className={messageName.join(' ')}>{username}</span>
								<span className={messageMessage.join(' ')}>{message}</span>
								<span className={messageTime.join(' ')}>{time}</span>
							</span>
						</span>
					</li>
				:
				<li className={messageBody.join(' ')}>
					<span className={messageText.join(' ')}>
						<span className={messageContent.join(' ')} >
							<span className={messageMessage.join(' ')}>{message}</span>
							<span className={messageTime.join(' ')}>{time}</span>
						</span>
					</span>
				</li>
			}
		</div >
	)
}

export default Message