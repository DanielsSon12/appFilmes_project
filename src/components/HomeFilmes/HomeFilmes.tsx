import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners'

import type { Filme } from '@/types/filme'

import useDataFetchingFilmes from '../../service/DataFetchingFilmes'
import BannerFilmes from '../BannerFilmes/BannerFilmes'
import CardFilme from '../CardFilme/CardFilme'
import ModalFilme from '../ModalFilme/ModalFilme'

const HomeFilmes = () => {
	const { filmes, loading, error } = useDataFetchingFilmes()

	const [showLoading, setShowLoading] = useState(true)
	const [selectFilme, setSelectFilme] = useState<Filme | null>(null)

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
			<main className="m-auto flex min-h-screen items-center justify-center bg-slate-950 text-center text-7xl text-white">
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 0 }}
					transition={{ duration: 1.3, ease: 'easeInOut' }}
				>
					<HashLoader color="#c8cadf" size={100} />
				</motion.div>
			</main>
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
			<section className="relative w-full">
				<BannerFilmes images={filmes} />

				<svg
					className="pointer-events-none absolute bottom-0 left-0 z-10 h-45 w-full"
					viewBox="0 0 1440 180"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#020617" stopOpacity="0" />

							<stop offset="100%" stopColor="#020617" stopOpacity="1" />
						</linearGradient>
					</defs>

					<rect width="100%" height="100%" fill="url(#gradient)" />
				</svg>
			</section>

			<section className="relative m-auto">
				<motion.div
					initial={{ y: 230, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					viewport={{ once: true, amount: 0.1 }}
					transition={{ duration: 1 }}
					className="m-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-4 pt-30 pb-10 sm:grid-cols-2 sm:gap-4 sm:px-6 sm:pt-40 md:grid-cols-3 md:gap-5 md:px-8 md:pt-45 lg:grid-cols-4 lg:px-4 lg:pt-50"
				>
					{filmes.map((filme) => (
						<CardFilme key={filme.id} filme={filme} onClick={() => setSelectFilme(filme)} />
					))}
				</motion.div>
			</section>

			<ModalFilme filme={selectFilme} fechar={() => setSelectFilme(null)} />
		</main>
	)
}

export default HomeFilmes
