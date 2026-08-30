import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners'

import useDataFetchingFilmes from '../../service/DataFetchingFilmes'
import BannerFilmes from '../BannerFilmes/BannerFilmes'
import CardFilme from '../CardFilme/CardFilme'

const HomeFilmes = () => {
	const { filmes, loading, error } = useDataFetchingFilmes()

	const [showLoading, setShowLoading] = useState(true)

	useEffect(() => {
		if (!loading) {
			const timer = setTimeout(() => {
				setShowLoading(false)
			}, 1500)

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
			<div className="fixed right-8 z-50 translate-y-1/2 opacity-30 max-md:right-4">
				<a href="https://github.com/DanielsSon12/appFilmes_project" className="github-icon">
					<motion.img
						src="https://skillicons.dev/icons?i=github"
						alt="github"
						className="w-10 max-md:w-8"
						whileHover={{ scale: 1.2, rotate: 5 }}
					/>
				</a>
			</div>
			<section className="w-full">
				<BannerFilmes images={filmes} />
			</section>

			<section className="relative m-auto">
				<CardFilme filmes={filmes} />
			</section>
		</main>
	)
}

export default HomeFilmes
