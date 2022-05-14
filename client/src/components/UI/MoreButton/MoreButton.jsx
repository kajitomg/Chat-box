import React from 'react'
import cl from './MoreButton.module.css'
const moreButton = () => {
	const moreWrapper = [cl.moreWrapper]

	return (
		<div className={moreWrapper.join(' ')}>
			<span></span>
			<span></span>
			<span></span>
		</div>
	)
}

export default moreButton