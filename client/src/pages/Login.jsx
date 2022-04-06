import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadrooms } from '../actions/room'
import { login } from '../actions/user'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'

const Login = () => {

	const dispatch = useDispatch()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	return (
		<div className="login">
			<form action="" className='login__form'>
				<MyInput value={username} onChange={(e) => setUsername(e.target.value)} className='login__input' type="text" placeholder="Enter your nickname" />
				<MyInput value={password} onChange={(e) => setPassword(e.target.value)} className='login__input' type="password" placeholder="Enter your password" />
				<MyButton onClick={async (e) => { e.preventDefault(); await dispatch(login(username, password)); await dispatch(loadrooms()) }} to='/Chats' className='login__button'>Login</MyButton>
			</form>
		</div>
	)
}

export default Login