import type { Filme } from '@/types/filme'

import StarsRating from '../StarsRating/StarsRating'

interface CardFilmeProps {
	filmes: Filme[]
}

const CardFilme = ({ filmes }: CardFilmeProps) => {
	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{filmes.map((filme) => (
				<div key={filme.id} className="relative h-full w-full">
					<div className="group relative aspect-2/3 w-full overflow-hidden rounded-md">
						<img
							src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
							alt={filme.title}
							className="relative h-full w-full rounded-md object-cover"
						/>
					</div>

					<div className="absolute inset-0 flex flex-col justify-end p-3">
						<h1 className="text-lg text-white">{filme.title}</h1>
						<StarsRating rating={filme.vote_average} />

						<div>
							<p className="mt-2 line-clamp-3 text-sm text-amber-100">{filme.overview}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default CardFilme
