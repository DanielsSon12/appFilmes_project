import axios from 'axios'
import { useEffect, useState } from 'react'

import type { Filme } from '@/types/filme'

const useDataFetchingFilmes = () => {
	const [filmes, setFilmes] = useState<Filme[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		axios({
			method: 'get',
			url: 'https://api.themoviedb.org/3/discover/movie',
			params: {
				api_key: 'd455e4a24f9f8a15ccb533a1055ffc5a',
				language: 'pt-BR',
			},
		})
			.then((response) => {
				console.log(response.data.results)

				setFilmes(response.data.results)
			})
			.catch((error) => {
				console.error(error)

				setError(error.message)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	return {
		filmes,
		loading,
		error,
	}
}

export default useDataFetchingFilmes
