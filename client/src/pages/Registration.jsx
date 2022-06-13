import '../styles/Registration/Registration.css'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadRoomsAction } from '../actions/room'
import { registrationAction } from '../actions/user'
import MyButton from '../components/UI/MyButton/MyButton'
import MyInput from '../components/UI/MyInput/MyInput'

const Registration = () => {
	const dispatch = useDispatch()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const registrationfn = async (e) => {
		await e.preventDefault();
		await dispatch(registrationAction(username, password));
		await dispatch(loadRoomsAction())
	}
	return (
		<section className="registration">
			<form className='registration__form'>
				<MyInput value={username} onChange={(e) => setUsername(e.target.value)} className='registration__input' type="text" placeholder="Enter your nickname" />
				<MyInput value={password} onChange={(e) => setPassword(e.target.value)} className='registration__input' type="password" placeholder="Enter your password" />
				<MyButton to='/Chat' className='registration__button' onClick={(e) => registrationfn(e)}>Registration</MyButton>
			</form>
		</section>
	)
}

export default Registration