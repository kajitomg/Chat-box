import React, { useState } from 'react'
import avatarLogo from '../../img/avatar/default-avatar.jpg'
import creatorCrown from '../../img/icons/creator-crown.png'
import administratorStar from '../../img/icons/administrator-star.png'
import krest from '../../img/icons/krest.png'
import galochka from '../../img/icons/galochka.png'
import pencil from '../../img/icons/Pencil.png'
import trasher from '../../img/icons/trasher.png'
import gear from '../../img/icons/gear.png'
import MyInput from '../UI/MyInput/MyInput'
import MyModal from '../UI/MyModal/MyModal'
import MyButton from '../UI/MyButton/MyButton'
import { useDispatch } from 'react-redux'
import { createLink, deleteLink, deleteroom, deleteRoomAvatar, editChatDescription, editChatName, editLink, leavetheroom, loadrooms, uploadRoomAvatar } from '../../actions/room'

const MoreCreator = ({ navigate, user, users, chat, moreInfo, editAvatar, setEditAvatar }) => {
	const [modalCreateVisible, setModalCreateVisible] = useState(false)
	const [modalEditVisible, setModalEditVisible] = useState(false)
	const [linkName, setLinkName] = useState('')
	const [linkLink, setLinkLink] = useState('')
	const [linkID, setLinkID] = useState('')
	const [roomName, setRoomName] = useState(chat.roomname)
	const [roomDescription, setRoomDescription] = useState(chat.description)
	const dispatch = useDispatch()
	const chatMore = ['chat__more', 'more']
	const avatarEdit = ['room-avatar__edit']
	const moreUsers = ['more__users-btn']
	const moreLinks = ['more__links-btn']
	const moreLinksAdd = ['links__add']
	const moreLinksWrapper = ['more__links', 'links']
	const moreUsersWrapper = ['more__users-info', 'phone']
	const [usersIsActive, setUsersIsActive] = useState(false)
	const [linksIsActive, setLinksIsActive] = useState(true)
	const [editRoomName, setEditRoomName] = useState(false)
	const [editRoomDescription, setEditRoomDescription] = useState(false)
	const api = require('../../path/api_url')
	const path = api.API_URL
	const avatarURL = chat.avatar ? `${path + chat.avatar}` : avatarLogo
	if (moreInfo) {
		chatMore.push('active')
	}
	if (!moreInfo) {
		chatMore.slice(-1, 1)
	}
	if (editAvatar) {
		avatarEdit.push('active')
	}
	if (!editAvatar) {
		avatarEdit.slice(-1, 1)
	}
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
	function changeHandler(e) {
		const file = e.target.files[0]
		dispatch(uploadRoomAvatar(file, chat._id))
	}
	function linkCreate() {
		if (!linkName || !linkLink) return
		dispatch(createLink(linkName, linkLink, chat._id))
		setModalCreateVisible(false)
	}
	function linkEdit() {
		if (!linkName || !linkLink) return
		dispatch(editLink(linkName, linkLink, chat._id, linkID))
		setModalEditVisible(false)
	}

	return (

		chat.role.map(role =>
			(role.role === 'Creator')
				?
				(role.userid === user._id)
					?
					<div className="more__columns" key={'creator' + user._id}>
						<div className="more__column more__column-left">
							<div className="more__info">
								<div className="more__room-avatar room-avatar active" key={'avatar' + user._id} onClick={(e) => {
									e.stopPropagation();
									setEditAvatar(!editAvatar)
								}}>
									<div className={avatarEdit.join(' ')} onClick={(e) => {
										e.stopPropagation()
									}}>
										<input accept='image/*' type="file" id="input__file" className="input input__file" onChange={(e) => {
											changeHandler(e)
										}} />
										<label htmlFor="input__file" className="input__file-button">
											<div className="room-avatar__change">Change Avatar</div>
										</label>
										<div className="room-avatar__delete" onClick={() => {
											if (chat.avatar) {
												return dispatch(deleteRoomAvatar(chat._id))
											}
											return
										}}>Delete Avatar</div>
									</div>
									<img src={avatarURL} alt="" />
								</div>
								<div className="more__roomname">
									{
										editRoomName
											?
											<div className="more__roomname-true creator" key={'roomname' + user._id}>
												<input value={roomName} className="more__roomname-input" accept='image/*' type="text" onChange={(e) => {
													setRoomName(e.target.value)
												}} />
												<img className="more__roomname-galochka" src={galochka} alt="" onClick={async () => {
													await dispatch(editChatName(chat._id, roomName));
													await setEditRoomName(false)
												}}
												/>
												<img className="more__roomname-krest" src={krest} alt="" onClick={() => {
													setEditRoomName(false)
												}} />
											</div>
											:
											<div className="more__roomname-false creator" key={'roomname' + user._id}>
												<div className="more__roomname-name">{chat.roomname}</div>
												<div className='more__roomname-wrapper'>
													<img className="more__roomname-pencil" src={pencil} alt="" onClick={() => {
														setEditRoomName(true);
														setRoomName(chat.roomname)
													}} />
												</div>
											</div>
									}
								</div>
							</div>
							<div className="more__descrption description">
								{
									editRoomDescription
										?
										<div className='description__wrapper description__wrapper-true' key={'roomdescription' + user._id}>
											<input value={roomDescription} className='description__input description__input-true' type="textarea" onChange={(e) => {
												setRoomDescription(e.target.value)
											}} />
											<img className="description__galochka" src={galochka} alt="" onClick={async () => {
												await dispatch(editChatDescription(chat._id, roomDescription));
												await setEditRoomDescription(false)
											}} />
											<img className="description__krest" src={krest} alt="" onClick={() => {
												setEditRoomDescription(false)
											}} />
										</div>
										:
										<div className='description__wrapper description__wrapper-false' key={'roomdescription' + user._id}>
											<div className="description__text description__text-false">
												{chat.description ? chat.description : 'Room description'}
											</div>
											<div className='description__edit-wrapper'>
												<img className="description__pencil" src={pencil} alt="" onClick={() => {
													setEditRoomDescription(true);
													setRoomDescription(chat.description)
												}} />
											</div>

										</div>
								}
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
								{
									editRoomDescription
										?
										<div className="links__wrapper" key={'roomlinks' + user._id}>
											<ul className="links__list">
												{chat.links.map((link) =>
													<li className="links__link" key={'roomlink' + link.id}>
														<div className='link__name-wrapper'>
															<span className="links__link-name">{link.linkname}</span>
															<a href={`http://${link.link}`} className="links__link-link">
																http://{link.link}
															</a>
														</div>
														<div className='link__interaction-wrapper'>
															<img className="links__pencil" src={pencil} alt="" onClick={() => {
																setModalEditVisible(true);
																setLinkName('');
																setLinkLink('');
																setLinkID(link.id)
															}} />
															<img className="links__trasher" src={trasher} alt="" />
														</div>
													</li>
												)}
											</ul>
										</div>
										:
										<div className="links__wrapper" key={'roomlinks' + user._id}>
											<ul className="links__list">
												{chat.links.map((link) =>
													<li className="links__link" key={'roomlink' + link.id}>
														<div className='link__name-wrapper'>
															<span className="links__link-name">{link.linkname}</span>
															<a href={`http://${link.link}`} className="links__link-link">
																http://{link.link}
															</a>
														</div>
														<div className='link__interaction-wrapper'>
															<img className="links__pencil" src={pencil} alt="" onClick={() => {
																setModalEditVisible(true);
																setLinkName('');
																setLinkLink('');
																setLinkID(link.id)
															}} />
															<img className="links__trasher" src={trasher} alt="" onClick={() => {
																dispatch(deleteLink(link.id, chat._id))
															}} />
														</div>

													</li>
												)}
											</ul>
										</div>
								}
								<MyModal visible={modalCreateVisible} setVisible={setModalCreateVisible}>
									<MyInput value={linkName} type='text' className='links__modal-input' placeholder='Link name' onChange={(e) => {
										setLinkName(e.target.value)
									}} />
									<MyInput value={linkLink} type='url' pattern="https://.*" className='links__modal-input' placeholder='Link' onChange={(e) => {
										setLinkLink(e.target.value)
									}} />
									<MyButton className='links__modal-button' onClick={() => {
										linkCreate()
									}}>Create link</MyButton>
								</MyModal>
								<MyModal visible={modalEditVisible} setVisible={setModalEditVisible}>
									<MyInput value={linkName} type='text' className='links__modal-input' placeholder='Link name' onChange={(e) => {
										setLinkName(e.target.value)
									}} />
									<MyInput value={linkLink} type='url' pattern="https://.*" className='links__modal-input' placeholder='Link' onChange={(e) => {
										setLinkLink(e.target.value)
									}} />
									<MyButton className='links__modal-button' onClick={() => {

										linkEdit()

									}}>Edit link</MyButton>
								</MyModal>
							</div>

							<div className={moreLinksAdd.join(' ')} key={'avatar' + user._id} onClick={(e) => {
								e.stopPropagation();
								setModalCreateVisible(true);
								setLinkName('');
								setLinkLink('')
							}}>
								<span></span>
								<span></span>
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



							<div className="more__edit" key={'edit' + user._id}>
								<img className="more__edit-gear" src={gear} alt="" />
								<div className="more__delete-room" key={'delete' + user._id} onClick={async (e) => {
									e.stopPropagation();
									await dispatch(deleteroom(chat._id, user._id));
									navigate('/chats/');
									dispatch(loadrooms())
								}}>
									delete room
								</div>
							</div>

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
							<div className='more__leave' onClick={async () => {
								leavetheroom(chat._id, user._id);
								navigate('/chats/');
								dispatch(loadrooms())
							}}><span>Leave room</span></div>
						</div>
					</div>
					:
					''
				: ''
		)


	)
}

export default MoreCreator