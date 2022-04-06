import React from 'react'
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
	const navbarContent = [classes.navbar__content]
	if (isAuth) {
		navbarContent.push(classes.auth)
	}
	return (
		<div className={classes.navbar}>
			<Link to="/Chats" className={classes.navbar__logo}></Link>
			{isAuth
				?
				<div className={navbarContent.join(' ')}>
					<div className={classes.navbar__account} onClick={() => {
						navigate(`Account/${currentUser.id}`);
					}}>
						<div className={classes.navbar__avatar}></ div >
						<div className={classes.navbar__username}>{username}</ div >
					</div>
					<div className={classes.navbar__links}>
						<div className={classes.navbar__link} onClick={() => dispatch(logout())}>Logout</ div >
					</div>
				</div>
				:
				<div className={navbarContent.join(' ')}>
					<div className={classes.navbar__links}>
						<Link to="/login" className={classes.navbar__link}>Login</ Link>
						<Link to="/registration" className={classes.navbar__link}>Registration</Link >
					</div>
				</div>
			}

		</div >
	)
}

export default Navbar