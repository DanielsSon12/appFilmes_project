import useDataFetchingFilmes from '../../service/DataFetchingFilmes'
import CardFilme from '../CardFilme/CardFilme'

const HomeFilmes = () => {
	const { filmes, loading, error } = useDataFetchingFilmes()

	// const [showLoading, setShowLoading] = useState(true)

	// useEffect(() => {
	//   const timer = setTimeout(() => {
	//     setShowLoading(false)
	//   }, 1000)

	//   return () => clearTimeout(timer)
	// }, [])

	if (loading) {
		return (
			<main className="m-auto flex min-h-screen items-center bg-slate-950 text-center text-7xl text-white">
				<div>
					<h1>Loading...</h1>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main className="m-auto flex min-h-screen items-center bg-slate-950 text-center text-7xl text-white">
				<div>
					<h1>Erro ao carregar filmes!</h1>
				</div>
			</main>
		)
	}

	return (
		<main className="min-h-screen bg-slate-950">
			<h1 className="text-4xl text-white">App de Filmes</h1>

			<section>
				<CardFilme filmes={filmes} />
			</section>
		</main>
	)
}

export default HomeFilmes
