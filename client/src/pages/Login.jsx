import '../styles/Login/Login.css'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadRoomsAction } from '../actions/room'
import { loginAction } from '../actions/user'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'

const Login = () => {

	const dispatch = useDispatch()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const loginfn = async (e) => {
		e.preventDefault();
		await dispatch(loginAction(username, password));
		return await dispatch(loadRoomsAction())
	}

	return (
		<section className="login">
			<form action="" className='login__form'>
				<MyInput value={username} onChange={(e) => setUsername(e.target.value)} className='login__input' type="text" placeholder="Enter your nickname" />
				<MyInput value={password} onChange={(e) => setPassword(e.target.value)} className='login__input' type="password" placeholder="Enter your password" />
				<MyButton onClick={loginfn} to='/Chats' className='login__button'>Login</MyButton>
			</form>
		</section>
	)
}

export default Login