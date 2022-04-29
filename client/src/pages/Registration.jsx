import '../styles/Registration.css'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadrooms } from '../actions/room'
import { registration } from '../actions/user'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'

const Registration = () => {
	const dispatch = useDispatch()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	return (
		<div className="registration">
			<form className='registration__form'>
				<MyInput value={username} onChange={(e) => setUsername(e.target.value)} className='registration__input' type="text" placeholder="Enter your nickname" />
				<MyInput value={password} onChange={(e) => setPassword(e.target.value)} className='registration__input' type="password" placeholder="Enter your password" />
				<MyButton to='/Chat' className='registration__button' onClick={async (e) => {
					await e.preventDefault();
					await dispatch(registration(username, password));
					await dispatch(loadrooms())
				}}>Registration</MyButton>
			</form>
		</div>
	)
}

export default Registration