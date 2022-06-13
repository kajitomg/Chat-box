import '../../styles/Account/Account.css'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getUserAction } from '../../actions/user'
import { useFetching } from '../../hooks/useFetching'
import socket from '../../socket'
import AccountOwner from './AccountOwner'
import AccountUser from './AccountUser'

const Account = () => {
	const location = useLocation()
	const userID = location.pathname.split('/').reverse()[0]
	const user = useSelector(state => state.user.user)
	const currentUser = useSelector(state => state.user.currentUser)
	const dispatch = useDispatch()

	const [fetchUser] = useFetching(async () => {
		await dispatch(getUserAction(userID))
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
			return fetchUser()
		}
	}, [location])

	return (
		<section className="account">
			{
				currentUser._id === user._id
					?
					<AccountOwner />
					:
					<AccountUser />
			}
		</section>
	)
}

export default Account