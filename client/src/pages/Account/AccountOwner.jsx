import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadUserAvatarAction } from '../../actions/user'
import Loader from '../../components/UI/Loader/Loader'
import MyModal from '../../components/UI/MyModal/MyModal'
import avatarLogo from '../../img/avatar/default-avatar.jpg'

const AccountOwner = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.user.user)
	const currentUser = useSelector(state => state.user.currentUser)
	const [modalVisible, setModalVisible] = useState(false)
	const api = require('../../path/api_url')
	const path = api.API_URL
	const avatarURL = user.avatar ? `${path + user.avatar}` : avatarLogo

	function changeHandler(e) {
		const file = e.target.files[0]
		return dispatch(uploadUserAvatarAction(file, currentUser._id))
	}

	return (
		<div className='account__body'>
			<div className='account__columns'>
				<MyModal visible={modalVisible} setVisible={setModalVisible}>
					<input accept='image/*' onChange={(e) => { changeHandler(e) }} type='file' placeholder='Edit avatar' />
				</MyModal>
				<div className="account__column-left account__column">
					<div className='account__avatar'>
						{user.info !== undefined
							? <img src={avatarURL} alt="" />
							: ''
						}
					</div>
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

					<div className='account__edit' onClick={() => setModalVisible(true)}>
						edit account
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
	)
}

export default AccountOwner