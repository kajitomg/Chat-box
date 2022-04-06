import { useState } from "react"

export const useFetching = (callback) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const fetching = async (roomid, page) => {
		try {
			setIsLoading(true)
			await callback(roomid, page)
		} catch (e) {
			setError(e.message)
		} finally {
			setIsLoading(false)
		}

	}
	return [fetching, isLoading, setIsLoading, error]
}