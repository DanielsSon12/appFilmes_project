import { FaRegStar, FaStar } from 'react-icons/fa'

export interface Star {
	rating: number
}

const StarsRating = (props: Star) => {
	const numStars = Math.round(props.rating / 2)

	const fullStars = []
	const emptyStars = []

	for (let i = 0; i < 5; i++) {
		if (i < numStars) {
			fullStars.push(i)
		} else {
			emptyStars.push(i)
		}
	}

	return (
		<div className="flex flex-row gap-1">
			{fullStars.map((index) => (
				<FaStar key={index} className="text-amber-400" />
			))}
			{emptyStars.map((index) => (
				<FaRegStar key={index} className="text-amber-400" />
			))}
		</div>
	)
}

export default StarsRating
