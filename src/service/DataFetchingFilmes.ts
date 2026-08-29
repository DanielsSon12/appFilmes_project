import axios from "axios"
import { useEffect, useState } from "react"

interface Filme {
    id: number
    title: string
    overview: string
    poster_path: string
    vote_average: number
}

const DataFetchingFilmes = () => {
    const [filmes, setFilmes] = useState<Filme[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setLoading(true)
        axios({
            method:'get',
            url: 'https://api.themoviedb.org/3/discover/movie',
            params: {
                api_key: 'a4e3c053e886d058c883d9106e5892cc',
                language: 'pt-br',
            }
        }).then(response => {
            console.log(response)
            setFilmes(response.data.results);
        }).catch(error => {
            setError(error)
            setLoading(false)
        }).finally(() => setLoading(false))
    }, [])

    return{
        filmes, loading, error
    }
}

export default DataFetchingFilmes