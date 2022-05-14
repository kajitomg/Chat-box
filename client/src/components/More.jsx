import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { leavetheroom, loadrooms } from '../actions/room'
import '../styles/More.css'
import MoreCreator from './More/MoreCreator'
import MoreUser from './More/MoreUser'

const More = ({ chat, user, users, setMoreInfo, moreInfo }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const chatMore = ['chat__more', 'more']
	const [editAvatar, setEditAvatar] = useState(false)
	if (moreInfo) {
		chatMore.push('active')
	}
	if (!moreInfo) {
		chatMore.slice(-1, 1)
	}

	return (
		<div className={chatMore.join(' ')} onClick={() => setEditAvatar(false)}>
			<div className='more__button-close' onClick={() => setMoreInfo(!moreInfo)}>
				<span></span>
				<span></span>
			</div>
			{chat._id !== undefined &&
				<div className='more__wrapper'>
					<MoreCreator navigate={navigate} user={user} users={users} chat={chat} moreInfo={moreInfo} editAvatar={editAvatar} setEditAvatar={setEditAvatar} />
					<MoreUser navigate={navigate} user={user} users={users} chat={chat} />
				</div>
			}
		</div >
	)
}

export default More