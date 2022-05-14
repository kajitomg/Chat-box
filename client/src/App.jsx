import './styles/Null.css'
import './styles/App.css'
import React, { useEffect, useState } from "react";
import Background from "./components/Background";
import Login from './pages/Login';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Chat from './pages/Chat';
import Registration from './pages/Registration';
import Navbar from './components/UI/Navbar/Navbar';
import Chats from './pages/Chats';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './actions/user';
import Loader from './components/UI/Loader/Loader';
import Account from './pages/Account';
import socket from './socket';
//import io, { Socket } from 'socket.io-client'
function App() {
	const isAuth = useSelector(state => state.user.isAuth)
	const dispatch = useDispatch();
	const [isContentLoader, setIsContentLoader] = useState(false)
	const user = useSelector(state => state.user.currentUser)
	useEffect(async () => {
		setIsContentLoader(true)
		await dispatch(auth())
		setIsContentLoader(false)
	}, [])
	useEffect(() => {

		if (isAuth) {
			socket.connect()
			socket.on('connect', () => {
				console.log(socket.id)
			})
			socket.emit('user-connection', { userid: user._id })
		}

		if (!isAuth) {
			socket.disconnect()
		}
	}, [isAuth])
	return (
		<div className="wrapper">
			<main className="page">
				<div className='main-screen'>
					<BrowserRouter>
						<Background />
						<Navbar username={user.username} />
						<div className="content">
							<div className='container'>
								{isContentLoader
									? <Loader />
									: isAuth
										?
										<Routes>
											<Route path='/Chats' element={<Chats />} />
											<Route path='/Chat/:id' element={<Chat />} />
											<Route path='/Account/:id' element={<Account />} />
											<Route path='*' element={<Chats />} />
										</Routes>
										:
										<Routes>
											<Route path='/Registration' element={<Registration />} />
											<Route path='/Login' element={<Login />} />
											<Route path='*' element={<Login />} />
										</Routes>

								}
							</div>

						</div >
					</BrowserRouter>
				</div>
			</main >
		</div >
	);
}

export default App

