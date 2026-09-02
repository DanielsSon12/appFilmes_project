import { motion } from 'motion/react'

import type { Filme } from '@/types/filme'

import StarsRating from '../StarsRating/StarsRating'

interface CardFilmeProps {
	filme: Filme
	onClick: () => void
}

const CardFilme = ({ filme, onClick }: CardFilmeProps) => {
	return (
		<motion.div onClick={onClick}>
			<motion.div
				onClick={onClick}
				key={filme.id}
				initial="start"
				whileHover="final"
				whileTap={{ scale: 1.05, rotate: -2 }}
				variants={{
					start: {
						scale: 1,
					},
					final: {
						scale: 1.05,
					},
				}}
				transition={{ duration: 0.3 }}
				className="relative aspect-2/3 w-full overflow-hidden rounded-md"
			>
				<motion.img
					variants={{
						start: {
							scale: 1,
						},
						final: {
							scale: 1.1,
						},
					}}
					transition={{ duration: 1 }}
					src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
					alt={filme.title}
					className="h-full w-full object-cover"
				/>

				<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

				<div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3">
					<h1 className="line-clamp-2 text-sm font-medium text-white sm:text-base md:text-lg">
						{filme.title}
					</h1>

					<StarsRating rating={filme.vote_average} />

					<motion.div
						variants={{
							start: {
								height: 0,
								opacity: 0,
							},
							final: {
								height: 'auto',
								opacity: 1,
							},
						}}
						transition={{ duration: 0.3 }}
						className="hidden overflow-hidden md:block"
					>
						<p className="mt-2 mb-2 line-clamp-3 text-xs text-amber-50 lg:text-sm">
							{filme.overview}
						</p>
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	)
}

export default CardFilme
