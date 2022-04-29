import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout, setUser } from '../../../reducers/userReducer'
import MyButton from '../MyButton/MyButton'
import classes from './Navbar.module.css'

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

	let [isActive, setIsActive] = useState(false)
	if (isActive) {
		navbar.push('active')
		navbarBurger.push('active')
		navbarLinks.push('active')
		navbarLink.push('active')
		spanActive.push('active')
	}
	if (!isActive) {
		navbar.slice(-1, 1)
		navbarBurger.slice(-1, 1)
		navbarLinks.slice(-1, 1)
		navbarLink.slice(-1, 1)
		spanActive.slice(-1, 1)
	}
	if (isAuth) {
		navbarContent.push(classes.auth)
	}
	return (
		<div className={navbar.join(' ')}>
			<Link to="/Chats" className={classes.navbarLogo}>Logo</Link>
			{isAuth
				?
				<div className={navbarContent.join(' ')}>
					<div className={classes.navbarAccount} onClick={() => {
						navigate(`Account/${currentUser.id}`);
					}}>
						<div className={classes.navbarAvatar}></ div >
						<div className={classes.navbarUsername}>{username}</ div >
					</div>
					<div className={classes.navbarLinks}>
						<div className={classes.navbarLink} onClick={() => dispatch(logout())}>Logout</ div >
					</div>
					<div className={navbarBurger.join(' ')} onClick={() => setIsActive(!isActive)}>
						<span className={spanActive.join(' ')}></span>
						<span className={spanActive.join(' ')}></span>
						<span className={spanActive.join(' ')}></span>
					</div>
				</div>
				:
				<div className={navbarContent.join(' ')}>
					<div className={classes.navbarLinks}>
						<Link to="/login" className={classes.navbarLink}>Login</ Link>
						<Link to="/registration" className={classes.navbarLink}>Registration</Link >
					</div>
				</div>
			}

		</div >
	)
}

export default Navbar