import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../../../styles/Room/More/More.css'
import MoreCreator from './MoreCreator'
import MoreUser from './MoreUser'

const More = ({ setMoreInfo, moreInfo }) => {
	const chat = useSelector(state => state.room.room)
	const chatMore = ['chat__more', 'more']
	const [editAvatar, setEditAvatar] = useState(false)
	if (moreInfo) {
		chatMore.push('active')
	}

	return (
		<div className={chatMore.join(' ')} onClick={() => setEditAvatar(false)}>
			<div className='more__button-close' onClick={() => setMoreInfo(!moreInfo)}>
				<span></span>
				<span></span>
			</div>
			{chat._id !== undefined &&
				<div className='more__wrapper'>
					<MoreCreator
						editAvatar={editAvatar}
						setEditAvatar={setEditAvatar}
					/>
					<MoreUser
					/>
				</div>
			}
		</div >
	)
}

export default More