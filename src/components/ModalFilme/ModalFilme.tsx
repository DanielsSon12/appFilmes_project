import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

import type { Filme } from '@/types/filme'

import StarsRating from '../StarsRating/StarsRating'

interface ModalFilmeProps {
	filme: Filme | null
	fechar: () => void
}

const ModalFilme = ({ filme, fechar }: ModalFilmeProps) => {
	useEffect(() => {
		if (!filme) return

		const overflowAnterior = document.body.style.overflow

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				fechar()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = overflowAnterior
		}
	}, [filme, fechar])

	return (
		<AnimatePresence>
			{filme && (
				<>
					<motion.div
						className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						onClick={fechar}
					/>

					{/* Modal */}
					<motion.div
						className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-slate-900 shadow-2xl"
						initial={{
							opacity: 0,
							scale: 0.8,
							y: 40,
						}}
						animate={{
							opacity: 1,
							scale: 1,
							y: 0,
						}}
						exit={{
							opacity: 0,
							scale: 0.8,
							y: 40,
						}}
						transition={{
							type: 'spring',
							stiffness: 250,
							damping: 22,
						}}
						onClick={(event) => event.stopPropagation()}
					>
						{/* Botão fechar */}
						<motion.button
							type="button"
							onClick={fechar}
							whileHover={{
								scale: 1.1,
								rotate: 90,
							}}
							whileTap={{
								scale: 0.85,
							}}
							className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/70 text-2xl text-white backdrop-blur-sm transition-colors hover:bg-black"
							aria-label="Fechar modal"
						>
							×
						</motion.button>

						{/* Conteúdo */}
						<div className="flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:p-8">
							{/* Poster */}
							<motion.img
								src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
								alt={filme.title}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 }}
								className="mx-auto w-44 rounded-xl object-cover shadow-2xl sm:w-52 md:mx-0 md:w-60"
							/>

							{/* Informações */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.15 }}
								className="flex flex-1 flex-col"
							>
								<h2 className="pr-10 text-2xl font-bold text-white sm:text-3xl">{filme.title}</h2>

								{/* Data */}
								<p className="mt-2 text-sm text-slate-400">
									Lançamento:{' '}
									{filme.release_date
										? new Date(filme.release_date).toLocaleDateString('pt-BR')
										: 'Não informado'}
								</p>

								{/* Nota */}
								<div className="mt-4 flex items-center gap-3">
									<StarsRating rating={filme.vote_average} />

									<span className="text-sm font-semibold text-white">
										{filme.vote_average.toFixed(1)}
									</span>
								</div>

								{/* Sinopse */}
								<div className="mt-6">
									<h3 className="mb-2 text-lg font-semibold text-white">Sinopse</h3>

									<p className="text-sm leading-6 text-slate-300 sm:text-base">
										{filme.overview || 'Sinopse não disponível.'}
									</p>
								</div>

								{/* Botão */}
								<motion.button
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.95 }}
									onClick={fechar}
									className="mt-6 w-full cursor-pointer rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 md:w-fit"
								>
									Fechar
								</motion.button>
							</motion.div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export default ModalFilme
