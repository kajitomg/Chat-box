import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../../../styles/Chat/More/More.css'
import MoreCreator from './MoreCreator'
import MoreUser from './MoreUser'

const More = ({ chat, setMoreInfo, moreInfo }) => {
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
					{moreInfo
						?
						<MoreCreator
							editAvatar={editAvatar}
							setEditAvatar={setEditAvatar}
						/>
						:
						<MoreUser
						/>
					}
				</div>
			}
		</div >
	)
}

export default More