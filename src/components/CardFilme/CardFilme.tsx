import type { Filme } from '@/types/filme'

import StarsRating from '../StarsRating/StarsRating'

interface CardFilmeProps {
	filmes: Filme[]
}

const CardFilme = ({ filmes }: CardFilmeProps) => {
	return (
		<div>
			{filmes.map((filme) => (
				<div key={filme.id}>
					<div>
						<img
							src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
							alt={filme.title}
						/>
					</div>

					<div>
						<h1 className="text-white">{filme.title}</h1>
						<StarsRating rating={filme.vote_average} />

						<div>
							<p className="text-amber-100">{filme.overview}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default CardFilme
