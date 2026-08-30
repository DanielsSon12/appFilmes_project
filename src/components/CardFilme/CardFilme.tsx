import { motion } from 'motion/react'

import type { Filme } from '@/types/filme'

import StarsRating from '../StarsRating/StarsRating'

interface CardFilmeProps {
	filmes: Filme[]
}

const CardFilme = ({ filmes }: CardFilmeProps) => {
	return (
		<motion.div
			initial={{ y: 230, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 1 }}
			className="m-auto grid max-w-6xl grid-cols-1 items-center gap-5 pt-30 pb-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
		>
			{filmes.map((filme) => (
				<motion.div
					key={filme.id}
					initial="start"
					whileHover="final"
					variants={{
						start: {
							scale: 1,
						},
						final: {
							scale: 1.05,
						},
					}}
					transition={{ duration: 0.3 }}
					className="relative aspect-2/3 h-full w-full overflow-hidden rounded-md"
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
						className="h-full w-full rounded-md object-cover"
					/>

					<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

					<div className="absolute inset-0 flex flex-col justify-end p-3">
						<h1 className="text-lg text-white">{filme.title}</h1>

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
							className="overflow-hidden"
						>
							<p className="mt-2 line-clamp-3 text-sm text-amber-100">{filme.overview}</p>
						</motion.div>
					</div>
				</motion.div>
			))}
		</motion.div>
	)
}

export default CardFilme
