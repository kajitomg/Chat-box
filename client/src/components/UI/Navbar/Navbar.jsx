import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutReducer } from '../../../reducers/userReducer'
import MyButton from '../MyButton/MyButton'
import classes from './Navbar.module.css'
import avatarLogo from '../../../img/avatar/default-avatar.jpg'

const Navbar = ({ username }) => {
	const currentUser = useSelector(state => state.user.currentUser)
	const isAuth = useSelector(state => state.user.isAuth)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const navbarContent = [classes.navbarContent]
	const navbar = [classes.navbar]
	const navbarBurger = [classes.navbarBurger]
	const navbarLinks = [classes.navbarLinks]
	const navbarLink = [classes.navbarLink]
	const spanActive = []
	const api = require('../../../path/api_url')
	const path = api.API_URL
	const avatarURL = currentUser.avatar ? `${path + currentUser.avatar}` : avatarLogo

	let [isActive, setIsActive] = useState(false)
	if (isActive) {
		navbar.push(classes.active)
		navbarBurger.push(classes.active)
		navbarLinks.push(classes.active)
		navbarLink.push(classes.active)
		navbarContent.push(classes.active)
		spanActive.push(classes.active)
		if (window.parent.innerWidth > 760) {
			setIsActive(false)
		}
	}
	if (!isActive) {
		navbar.slice(-1, 1)
		navbarBurger.slice(-1, 1)
		navbarLinks.slice(-1, 1)
		navbarLink.slice(-1, 1)
		navbarContent.slice(-1, 1)
		spanActive.slice(-1, 1)
	}
	if (isAuth) {
		navbarContent.push(classes.auth)
	}
	return (
		<div className={navbar.join(' ')}>
			<Link to="/Chats" className={classes.navbarLogo} onClick={() => {
				setIsActive(false)
			}}>Logo</Link>
			{isAuth
				?
				<div className={navbarContent.join(' ')}>
					<div className={classes.navbarAccount} onClick={() => {
						navigate(`Account/${currentUser._id}`);
					}}>
						<div className={classes.navbarAvatar}><img src={avatarURL} alt="" /></ div >
						<div className={classes.navbarUsername}>{username}</ div >
					</div>
					<div className={navbarLinks.join(' ')}>
						<div className={navbarLink.join(' ')} onClick={() => dispatch(logoutReducer())}>Logout</ div >
					</div>
					<div className={navbarBurger.join(' ')} onClick={() => setIsActive(!isActive)}>
						<span className={spanActive.join(' ')}></span>
						<span className={spanActive.join(' ')}></span>
						<span className={spanActive.join(' ')}></span>
					</div>
				</div>
				:
				<div className={navbarContent.join(' ')}>
					<div className={navbarLinks.join(' ')} onClick={() => setIsActive(false)}>
						<Link to="/login" className={navbarLink.join(' ')}>Login</ Link>
						<Link to="/registration" className={navbarLink.join(' ')}>Registration</Link >
					</div>
					<div className={navbarBurger.join(' ')} onClick={() => setIsActive(!isActive)}>
						<span className={spanActive.join(' ')}></span>
						<span className={spanActive.join(' ')}></span>
						<span className={spanActive.join(' ')}></span>
					</div>
				</div>
			}

		</div >
	)
}

export default Navbar