import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners'

import useDataFetchingFilmes from '../../service/DataFetchingFilmes'
import CardFilme from '../CardFilme/CardFilme'

const HomeFilmes = () => {
	const { filmes, loading, error } = useDataFetchingFilmes()

	const [showLoading, setShowLoading] = useState(true)

	useEffect(() => {
		if (!loading) {
			const timer = setTimeout(() => {
				setShowLoading(false)
			}, 1200)

			return () => clearTimeout(timer)
		}
	}, [loading])

	if (loading || showLoading) {
		return (
			<motion.main className="m-auto flex min-h-screen items-center justify-center bg-slate-950 text-center text-7xl text-white">
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 0 }}
					transition={{ duration: 1.3, ease: 'easeInOut' }}
				>
					<HashLoader color="#c8cadf" size={100} />
				</motion.div>
			</motion.main>
		)
	}

	if (error) {
		return (
			<main className="m-auto flex min-h-screen items-center justify-center bg-slate-950 text-center text-7xl text-white">
				<div>
					<h1>Erro ao carregar filmes!</h1>
				</div>
			</main>
		)
	}

	return (
		<main className="relative min-h-screen bg-slate-950">
			<h1 className="m-auto text-center text-4xl text-white">App de Filmes</h1>

			<section className="m-auto">
				<CardFilme filmes={filmes} />
			</section>
		</main>
	)
}

export default HomeFilmes
