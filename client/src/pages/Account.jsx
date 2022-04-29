import '../styles/Account.css'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getUser } from '../actions/user'
import Loader from '../components/UI/Loader/Loader'
import { useFetching } from '../hooks/useFetching'
import socket from '../socket'

const Account = () => {
	let location = useLocation()
	let userID = location.pathname.split('/').reverse()[0]
	let user = useSelector(state => state.user.user)
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
	return (
		<section className="account">
			<div className='account__body'>
				<div className='account__columns'>
					<div className="account__column-left account__column">
						<div className='account__avatar'></div>
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