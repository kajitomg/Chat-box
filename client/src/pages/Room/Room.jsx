import '../../styles/App.css'
import '../../styles/Room/Room.css'
import React, { useEffect, useState } from 'react'
import { useLocation, } from 'react-router-dom'
import More from './More/More'
import Chat from './Chat/Chat'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersAction } from '../../actions/user'
import { useFetching } from '../../hooks/useFetching'
import socket from '../../socket'

const Room = () => {
	const location = useLocation()
	const roomid = location.pathname.split('/').reverse()[0]

	const [selectedMessage, setSelectedMessage] = useState('')
	const [moreInfo, setMoreInfo] = useState(false)
	const [message, setMessage] = useState('')

	const dispatch = useDispatch()

	const user = useSelector(state => state.user.currentUser)

	const [fetchConnectToRoom] = useFetching(async () => {
		await socket.emit('connect-to-room', { userid: user._id, roomid: roomid })
	})

	useEffect(async () => {
		await fetchConnectToRoom()
		await dispatch(getUsersAction(roomid))
	}, [location])

	return (
		<section className='room' onClick={() => {
			setSelectedMessage('');
			setMessage('')
		}}>
			{moreInfo
				&&
				<More moreInfo={moreInfo} setMoreInfo={setMoreInfo} />
			}
			{/* <RoomMain ref={scrollEnd} fetchMessages={fetchMessages} isMessagesLoading={isMessagesLoading} chatID={chatID} chat={chat} user={user} users={users} moreInfo={moreInfo} setMoreInfo={setMoreInfo} /> */}
			{!moreInfo
				&&
				<Chat moreInfo={moreInfo} setMoreInfo={setMoreInfo} location={location} />
			}
		</section>





	)
}

export default Room