import React, { useState } from 'react'
import avatarLogo from '../../img/avatar/default-avatar.jpg'
import creatorCrown from '../../img/icons/creator-crown.png'
import administratorStar from '../../img/icons/administrator-star.png'
import { leavetheroom, loadrooms } from '../../actions/room'
import { useDispatch } from 'react-redux'

const MoreUser = ({ navigate, user, users, chat }) => {
	const api = require('../../path/api_url')
	const path = api.API_URL
	const avatarURL = chat.avatar ? `${path + chat.avatar}` : avatarLogo
	const moreUsers = ['more__users-btn']
	const moreLinks = ['more__links-btn']
	const moreLinksAdd = ['links__add']
	const moreLinksWrapper = ['more__links', 'links']
	const moreUsersWrapper = ['more__users-info', 'phone']
	const [usersIsActive, setUsersIsActive] = useState(false)
	const [linksIsActive, setLinksIsActive] = useState(true)
	const dispatch = useDispatch()
	console.log(chat)
	if (linksIsActive) {
		moreLinks.push('active')
		moreLinksWrapper.push('active')
		moreLinksAdd.push('active')
	}
	if (!linksIsActive) {
		moreLinks.slice(-1, 1)
		moreLinksWrapper.slice(-1, 1)
		moreLinksAdd.slice(-1, 1)
	}
	if (usersIsActive) {
		moreUsers.push('active')
		moreUsersWrapper.push('active')
	}
	if (!usersIsActive) {
		moreUsers.slice(-1, 1)
		moreUsersWrapper.slice(-1, 1)
	}
	return (
		chat.role.map(role =>
			(role.role === 'User')
				?
				(role.userid === user._id)
					? <div className="more__columns" key={'user' + user._id}>
						<div className="more__column more__column-left">
							<div className="more__info">
								<div className="more__room-avatar room-avatar" key={'avatar' + user._id}>
									<img src={avatarURL} alt="" />
								</div>
								<div className="more__roomname">
									<div className="more__roomname-false user" key={'roomname' + user._id}>
										<div className="more__roomname-name user">{chat.roomname}</div>
									</div>
								</div>
							</div>
							<div className="more__descrption description">
								<div className='description__wrapper description__wrapper-false user' key={'roomdescription' + user._id}>
									<div className="description__text description__text-false">
										{chat.description ? chat.description : 'Room description'}
									</div>
								</div>
							</div>
							<div className='more__burger'>
								<div className={moreUsers.join(' ')} onClick={() => {
									setUsersIsActive(true);
									setLinksIsActive(false)
								}}>Users</div>
								<div className={moreLinks.join(' ')} onClick={() => {
									setUsersIsActive(false);
									setLinksIsActive(true)
								}}>Links</div>
							</div>
							<div className={moreLinksWrapper.join(' ')}>
								<div className="links__wrapper" key={'roomlinks' + user._id}>
									<ul className="links__list">
										{chat.links.map((link) =>
											<li className="links__link" key={'roomlink' + link.id}>
												<div className='link__name-wrapper'>

													<div className="links__link-name">{link.linkname}</div>
													<a href={link.link} className="links__link-link" >{link.link}</a>
												</div>
											</li>
										)}
									</ul>
								</div>
							</div>
							<div className={moreUsersWrapper.join(' ')}>
								<div className="more__users-number users-number">
									<div className="users-number__text">
										Number of users:
									</div>
									<div className="users-number__quantity">
										<div className="users-number__quantity-orb">
											<div className="users-number__number">{users.length}</div>
										</div>
									</div>
								</div>
								<ul className='more__users users'>
									{chat.role.map(role =>
										role.role === 'Creator'
										&& users.map(user =>
											user._id === role.userid
											&&
											<li className="users__user users__user-creator user" key={user._id} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>
												{<img className='user__avatar' src={user.avatar ? `${path + user.avatar}` : avatarLogo} alt="" />}
												{user.username}
												{<img className='user__crown' src={creatorCrown} alt="" />}
											</li>

										)
									)}
									{chat.role.map(role =>
										role.role === 'Administrator'
										&& users.map(user =>
											user._id === role.userid
											&&
											<li className="users__user users__user-administrator user" key={user._id} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>
												{<img className='user__avatar' src={user.avatar ? `${path + user.avatar}` : avatarLogo} alt="" />}
												{<div>{user.username}</div>}
												{<img className='user__star' src={administratorStar} alt="" />}
											</li>

										)
									)}
									{chat.role.map(role =>
										role.role === 'User'
										&& users.map(user =>
											user._id === role.userid
											&&
											<li className="users__user user" key={user._id} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>
												{<img className='user__avatar' src={user.avatar ? `${path + user.avatar}` : avatarLogo} alt="" />}
												{user.username}
											</li>

										)
									)}
								</ul>
							</div>
						</div>
						<div className="more__column more__column-right">
							<div className="more__users-info">
								<div className="more__users-number users-number">
									<div className="users-number__text">
										Number of users:
									</div>
									<div className="users-number__quantity">
										<div className="users-number__quantity-orb">
											<div className="users-number__number">{users.length}</div>
										</div>
									</div>
								</div>
								<ul className="more__users users">
									{chat.role.map(role =>
										role.role === 'Creator'
										&& users.map(user =>
											user._id === role.userid
											&&
											<li className="users__user users__user-creator user" key={user._id} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>
												{<img className='user__avatar' src={user.avatar ? `${path + user.avatar}` : avatarLogo} alt="" />}
												{user.username}
												{<img className='user__crown' src={creatorCrown} alt="" />}
											</li>
										)
									)}
									{chat.role.map(role =>
										role.role === 'Administrator'
										&& users.map(user =>
											user._id === role.userid
											&&
											<li className="users__user users__user-administrator user" key={user._id} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>
												{<img className='user__avatar' src={user.avatar ? `${path + user.avatar}` : avatarLogo} alt="" />}
												{<div>{user.username}</div>}
												{<img className='user__star' src={administratorStar} alt="" />}
											</li>

										)
									)}
									{chat.role.map(role =>
										role.role === 'User'
										&& users.map(user =>
											user._id === role.userid
											&&
											<li className="users__user user" key={user._id} onClick={() =>
												navigate(`/Account/${user._id}`)
											}>
												{<img className='user__avatar' src={user.avatar ? `${path + user.avatar}` : avatarLogo} alt="" />}
												{user.username}
											</li>

										)
									)}

								</ul>
							</div>
							<div className='more__leave' onClick={async () => {
								leavetheroom(chat._id, user._id);
								navigate('/chats/');
								dispatch(loadrooms())
							}}><span>Leave room</span></div>
						</div>
					</div>
					: ''
				: ''
		)
	)
}

export default MoreUser