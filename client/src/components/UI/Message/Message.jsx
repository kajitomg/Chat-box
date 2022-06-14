import React from 'react'
import cl from './Message.module.css'
import { useSelector } from 'react-redux'
import MessageNameCurrentReplyLayout from './Messages/MessageNameCurrentReplyLayout'
import MessageNameCurrentLayout from './Messages/MessageNameCurrentLayout'
import MessageNameReplyLayout from './Messages/MessageNameReplyLayout'
import MessageCurrentReplyLayout from './Messages/MessageCurrentReplyLayout'
import MessageCurrentLayout from './Messages/MessageCurrentLayout'
import MessageReplyLayout from './Messages/MessageReplyLayout'
import MessageLayout from './Messages/MessageLayout'
import MessageNameLayout from './Messages/MessageNameLayout'

const Message = ({ roomid, name, setEditMessage, setReplyMessage, message, user, current, selectedMessage, setSelectedMessage }) => {
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

	return (
		<div className={cl.messageWrapper} id={message._id}>
			{name
				?
				current
					?
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								?
								<MessageNameCurrentReplyLayout key={message._id}
									messageBody={messageBody} messageText={messageText} messageName={messageName}
									messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
									messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
									messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
									messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
									setReplyMessage={setReplyMessage} message={message} user={user}
									selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} replyMess={replyMess}
									roomid={roomid}
								/>
								: ''

						)
						:
						<MessageNameCurrentLayout
							messageBody={messageBody} messageText={messageText} messageName={messageName}
							messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
							messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
							messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
							messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
							setReplyMessage={setReplyMessage} message={message} user={user}
							selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage}
							roomid={roomid}
						/>
					:
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								?
								<MessageNameReplyLayout key={message._id}
									messageBody={messageBody} messageText={messageText} messageName={messageName}
									messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
									messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
									messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
									messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
									setReplyMessage={setReplyMessage} message={message} user={user}
									selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} replyMess={replyMess}
									roomid={roomid}
								/>
								: ''
						)
						:
						<MessageNameLayout
							messageBody={messageBody} messageText={messageText} messageName={messageName}
							messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
							messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
							messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
							messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
							setReplyMessage={setReplyMessage} message={message} user={user}
							selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage}
							roomid={roomid}
						/>
				:
				current
					?
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								?
								<MessageCurrentReplyLayout key={message._id}
									messageBody={messageBody} messageText={messageText} messageName={messageName}
									messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
									messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
									messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
									messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
									setReplyMessage={setReplyMessage} message={message} user={user}
									selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} replyMess={replyMess}
									roomid={roomid}
								/>
								: ''
						)
						:
						<MessageCurrentLayout
							messageBody={messageBody} messageText={messageText} messageName={messageName}
							messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
							messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
							messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
							messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
							setReplyMessage={setReplyMessage} message={message} user={user}
							selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage}
							roomid={roomid}
						/>
					:
					message.inheritance
						?
						replyMessages.map(replyMess =>
							replyMess._id === message.inheritance
								?
								<MessageReplyLayout key={message._id}
									messageBody={messageBody} messageText={messageText} messageName={messageName}
									messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
									messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
									messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
									messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
									setReplyMessage={setReplyMessage} message={message} user={user}
									selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} replyMess={replyMess}
									roomid={roomid}
								/>
								: ''
						)
						:
						<MessageLayout
							messageBody={messageBody} messageText={messageText} messageName={messageName}
							messageTime={messageTime} messageMessage={messageMessage} messageTextPopup={messageTextPopup}
							messageContentPopup={messageContentPopup} messageAvatar={messageAvatar} messageReplyContent={messageReplyContent}
							messageContent={messageContent} messageReply={messageReply} messageDelete={messageDelete}
							messageEdit={messageEdit} messageInteraction={messageInteraction} setEditMessage={setEditMessage}
							setReplyMessage={setReplyMessage} message={message} user={user}
							selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage}
							roomid={roomid}
						/>
			}
		</div >
	)
}

export default Message