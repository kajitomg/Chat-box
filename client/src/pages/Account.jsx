import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getUser } from '../actions/user'
import { useFetching } from '../hooks/useFetching'
import '../styles/Account.css'

const Account = () => {
	let location = useLocation()
	let userID = location.pathname.split('/').reverse()[0]
	let user = useSelector(state => state.user.user)
	console.log(user)
	const dispatch = useDispatch()
	const [fetchUser, isUserFetching, setIsUserFetching, userFetchError] = useFetching(async () => {
		await dispatch(getUser(userID))
	})
	useEffect(() => {
		fetchUser()
	}, [location])

	return (
		<section className="account">
			<div className='account__body'>
				<div className='account__columns'>
					<div className="account__column-left account__column">
						<div className='account__avatar'></div>
						<div className='account__username'>{user.username}</div>
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