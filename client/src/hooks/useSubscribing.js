import { useState } from "react"

export const useSubscribing = (callback) => {
	const [error, setError] = useState('')

	const Subscribing = async () => {
		try {
			await callback()
		} catch (e) {
			setTimeout(() => {
				Subscribing()
			}, 500)
		}

	}
	return [Subscribing, error]
}