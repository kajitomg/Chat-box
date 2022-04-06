import React from 'react'
import cl from './Message.module.css'

const Message = ({ name, time, message, username, current }) => {
	const messageBody = [cl.messageBody]
	const messageText = [cl.messageText]
	const messageName = [cl.messageName]
	const messageTime = [cl.messageTime]
	if (current) {
		messageBody.push(cl.currentUser)
		messageText.push(cl.currentUser)
		messageName.push(cl.currentUser)
		messageTime.push(cl.currentUser)
	}
	if (name) {
		messageBody.push(cl.name)
		messageText.push(cl.name)
	}
	return (
		<div>
			{name
				?
				current
					?
					<li className={messageBody.join(' ')}>
						<span className={messageName.join(' ')}>{username}</span>
						<span className={messageText.join(' ')}><span>{message}</span><span className={messageTime.join(' ')}>{time}</span></span>
					</li>
					:
					<li className={messageBody.join(' ')}>
						<span className={messageName.join(' ')}><span>{username}</span></span>
						<span className={messageText.join(' ')}><span>{message}</span><span className={messageTime.join(' ')}>{time}</span></span>
					</li>
				:
				<li className={messageBody.join(' ')}>
					<span className={messageText.join(' ')}><span>{message}</span><span className={messageTime.join(' ')}>{time}</span></span>
				</li>
			}
		</div>
	)
}

export default Message