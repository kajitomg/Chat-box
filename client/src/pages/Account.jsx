import '../styles/Account.css'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getUser, uploadUserAvatar } from '../actions/user'
import Loader from '../components/UI/Loader/Loader'
import { useFetching } from '../hooks/useFetching'
import socket from '../socket'
import avatarLogo from '../img/avatar/default-avatar.jpg'
import MyModal from '../components/UI/MyModal/MyModal'

const Account = () => {
	let location = useLocation()
	let userID = location.pathname.split('/').reverse()[0]
	let user = useSelector(state => state.user.user)
	let currentUser = useSelector(state => state.user.currentUser)
	const [modalVisible, setModalVisible] = useState(false)
	const avatarURL = user.avatar ? `http://chat-box:5000/${user.avatar}` : avatarLogo
	const dispatch = useDispatch()
	const [fetchUser] = useFetching(async () => {
		await dispatch(getUser(userID))
	})
	useEffect(() => {
		socket.emit('clear-room')
		socket.removeListener('connect-to-room')
		socket.removeListener('new-message')
	}, [])
	useMemo(() => {
		if (!socket.connected) {
			socket.removeListener('connect')
			socket.on('connect', () => {
				setTimeout(() => {
					fetchUser()
				}, 100)
			})
			return
		}
		if (socket.connected) {
			fetchUser()
			return
		}
	}, [location])
	function changeHandler(e) {
		const file = e.target.files[0]
		dispatch(uploadUserAvatar(file, currentUser._id))
	}
	return (
		<section className="account">
			<div className='account__body'>
				<div className='account__columns'>
					<MyModal visible={modalVisible} setVisible={setModalVisible}>
						<input accept='image/*' onChange={(e) => { changeHandler(e) }} type='file' placeholder='Edit avatar' />
					</MyModal>
					<div className="account__column-left account__column">
						<div className='account__avatar'>
							{user.info !== undefined
								? <img src={avatarURL} alt="" />
								: ''
							}
						</div>
						<div className='account__username'>{user.username}</div>
						<div className='account__online'>
							{user.info !== undefined
								?
								user.info.online
									? <div className='account__online-online'>Online</div>
									: <div className='account__online-offline'>Offline</div>
								:
								<Loader />
							}
						</div>
						{
							currentUser._id === user._id
								?
								<div className='account__edit' onClick={() => setModalVisible(true)}>
									edit account
								</div>
								: ''
						}
					</div>
					<div className="account__column-right account__column">
						<ul className="account__rooms">
							<li className="account__room">
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Account