import { shuffle } from 'lodash'
import { motion } from 'motion/react'

import DriftWall from '@/component/DriftWall'
import type { Filme } from '@/types/filme'

interface ImageFilmeProps {
	images: Filme[]
}

const BannerFilmes = ({ images }: ImageFilmeProps) => {
	const randomImages = shuffle(images)

	const driftWallImages = randomImages.map((filme) => ({
		image: `https://image.tmdb.org/t/p/original/${filme.poster_path}`,
	}))

	return (
		<div className="relative h-full w-full">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1.3, ease: 'easeInOut' }}
				style={{ height: 750, width: 'auto' }}
			>
				<DriftWall
					items={driftWallImages}
					columns={10}
					tileWidth={180}
					tileHeight={232}
					gap={18}
					tilt={20}
					turn={-14}
					perspective={1200}
					depth={130}
					speed={40}
					direction="up"
					variance={0.45}
					parallax={0.5}
					lift={54}
					fade={0.7}
					dim={0.55}
					overlayColor="#060010"
					radius={14}
					roll={15}
					pauseOnHover={false}
					grayscale={true}
				/>
			</motion.div>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white">
				<h1 className="text-7xl font-extrabold tracking-wider">
					CATALOGO DE{' '}
					<span className="text-blue-800">
						<br />
						FILMES
					</span>
				</h1>
			</div>
		</div>
	)
}

export default BannerFilmes
