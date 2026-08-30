import type { Filme } from '@/types/filme'

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

					<h1>
						{filme.title} - <span>{filme.vote_average}</span>
					</h1>

					<p>{filme.overview}</p>
				</div>
			))}
		</div>
	)
}

export default CardFilme
