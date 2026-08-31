import {
	type CSSProperties,
	type PointerEvent,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

export interface DriftWallItem {
	image: string
	title?: string
	href?: string
}

export interface DriftWallProps {
	items?: DriftWallItem[]
	columns?: number
	tileWidth?: number
	tileHeight?: number
	gap?: number
	radius?: number
	tilt?: number
	turn?: number
	roll?: number
	perspective?: number
	depth?: number
	speed?: number
	direction?: 'up' | 'down'
	variance?: number
	parallax?: number
	pauseOnHover?: boolean
	lift?: number
	fade?: number
	dim?: number
	grayscale?: boolean
	overlayColor?: string
	className?: string
	style?: CSSProperties
}

interface ColumnMeta {
	copyHeight: number
	copies: number
}

interface DriftWallCSSProperties extends CSSProperties {
	'--dw-tile-w'?: string
	'--dw-tile-h'?: string
	'--dw-gap'?: string
	'--dw-radius'?: string
	'--dw-lift'?: string
	'--dw-dim'?: number
	'--dw-gray'?: number
	'--dw-overlay'?: string
	'--dw-edge'?: string
}

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
	const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164]

	return {
		image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
		title: `Tile ${i + 1}`,
		href: undefined,
	}
})

const cx = (...parts: Array<string | false | undefined>): string => {
	return parts.filter(Boolean).join(' ')
}

const prefersReducedMotion = (): boolean => {
	return (
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)
}

const columnFactor = (index: number, variance: number): number => {
	const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1

	return 1 + variance * pseudo
}

const DriftWall = ({
	items = DEFAULT_ITEMS,
	columns = 5,
	tileWidth = 200,
	tileHeight = 132,
	gap = 18,
	radius = 14,
	tilt = 16,
	turn = -14,
	roll = 0,
	perspective = 1200,
	depth = 120,
	speed = 42,
	direction = 'up',
	variance = 0.45,
	parallax = 0.6,
	pauseOnHover = false,
	lift = 64,
	fade = 0.6,
	dim = 0.55,
	grayscale = false,
	overlayColor = '#060010',
	className = '',
	style,
}: DriftWallProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const planeRef = useRef<HTMLDivElement>(null)

	const trackRefs = useRef<Array<HTMLDivElement | null>>([])

	const rafRef = useRef<number | null>(null)

	const offsetsRef = useRef<number[]>([])
	const velocitiesRef = useRef<number[]>([])

	const hoveredColRef = useRef<number>(-1)
	const wallHoveredRef = useRef<boolean>(false)

	const pointerRef = useRef({
		x: 0,
		y: 0,
	})

	const pointerDampedRef = useRef({
		x: 0,
		y: 0,
	})

	const lastTsRef = useRef<number | null>(null)

	const [containerHeight, setContainerHeight] = useState(600)

	const [activeId, setActiveId] = useState<string | null>(null)

	const activeIdRef = useRef<string | null>(null)

	const [reduced, setReduced] = useState(prefersReducedMotion)

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

		const onChange = (event: MediaQueryListEvent) => {
			setReduced(event.matches)
		}

		mq.addEventListener('change', onChange)

		return () => {
			mq.removeEventListener('change', onChange)
		}
	}, [])

	/*
	 * Divide os itens entre as colunas
	 */
	const columnItems = useMemo<DriftWallItem[][]>(() => {
		const safeColumns = Math.max(1, columns)

		const cols: DriftWallItem[][] = Array.from({ length: safeColumns }, () => [])

		items.forEach((item, index) => {
			cols[index % safeColumns].push(item)
		})

		return cols.map((col) => (col.length > 0 ? col : items.slice(0, 1)))
	}, [items, columns])

	/*
	 * Calcula o tamanho e quantidade de cópias
	 */
	const columnMeta = useMemo<ColumnMeta[]>(() => {
		const unit = tileHeight + gap

		return columnItems.map((col) => {
			const copyHeight = Math.max(unit, col.length * unit)

			const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1)

			return {
				copyHeight,
				copies,
			}
		})
	}, [columnItems, tileHeight, gap, containerHeight])

	/*
	 * Observa a altura do container
	 */
	useLayoutEffect(() => {
		const container = containerRef.current

		if (!container) return

		const resizeObserver = new ResizeObserver(([entry]) => {
			if (!entry) return

			setContainerHeight(entry.contentRect.height || 600)
		})

		resizeObserver.observe(container)

		return () => {
			resizeObserver.disconnect()
		}
	}, [])

	/*
	 * Velocidade de cada coluna
	 */
	const baseVelocities = useMemo<number[]>(() => {
		const dirSign = direction === 'up' ? 1 : -1

		return columnItems.map((_, columnIndex) => {
			const altSign = columnIndex % 2 === 0 ? 1 : -1

			return speed * columnFactor(columnIndex, variance) * dirSign * altSign
		})
	}, [columnItems, speed, direction, variance])

	/*
	 * Inicializa os offsets
	 */
	useEffect(() => {
		offsetsRef.current = columnMeta.map(
			(meta, columnIndex) => meta.copyHeight * ((columnIndex * 0.37) % 1),
		)

		velocitiesRef.current = columnItems.map(() => 0)
	}, [columnMeta, columnItems])

	/*
	 * Transformação do plano 3D
	 */
	const applyPlaneTransform = useCallback(
		(px: number, py: number) => {
			const plane = planeRef.current

			if (!plane) return

			plane.style.transform =
				`translate(-50%, -50%) scale(1.18) ` +
				`rotateX(${tilt + py}deg) ` +
				`rotateY(${turn + px}deg) ` +
				`rotateZ(${roll}deg) ` +
				`translateZ(${-depth}px)`
		},
		[tilt, turn, roll, depth],
	)

	/*
	 * Loop de animação
	 */
	useEffect(() => {
		const animate = (timestamp: number) => {
			if (lastTsRef.current === null) {
				lastTsRef.current = timestamp
			}

			const deltaTime = Math.min(0.05, Math.max(0, timestamp - lastTsRef.current) / 1000)

			lastTsRef.current = timestamp

			/*
			 * Parallax
			 */
			const maxTilt = parallax * 8

			const targetX = pointerRef.current.x * maxTilt

			const targetY = -pointerRef.current.y * maxTilt

			const damping = 1 - Math.exp(-deltaTime / 0.12)

			pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damping

			pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damping

			applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y)

			/*
			 * Movimento das colunas
			 */
			if (!reduced) {
				for (let columnIndex = 0; columnIndex < trackRefs.current.length; columnIndex++) {
					const meta = columnMeta[columnIndex]

					if (!meta) continue

					const paused = wallHoveredRef.current && pauseOnHover

					const factor = paused || hoveredColRef.current === columnIndex ? 0 : 1

					const target = baseVelocities[columnIndex] * factor

					const ease = 1 - Math.exp(-deltaTime / (target === 0 ? 0.16 : 0.28))

					velocitiesRef.current[columnIndex] += (target - velocitiesRef.current[columnIndex]) * ease

					let next =
						(offsetsRef.current[columnIndex] ?? 0) + velocitiesRef.current[columnIndex] * deltaTime

					next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight

					offsetsRef.current[columnIndex] = next

					const element = trackRefs.current[columnIndex]

					if (element) {
						element.style.transform = `translate3d(0, ${-next}px, 0)`
					}
				}
			} else {
				/*
				 * Movimento reduzido
				 */
				for (let columnIndex = 0; columnIndex < trackRefs.current.length; columnIndex++) {
					const element = trackRefs.current[columnIndex]

					const meta = columnMeta[columnIndex]

					if (element && meta) {
						element.style.transform = `translate3d(0, ${-(
							offsetsRef.current[columnIndex] ?? 0
						)}px, 0)`
					}
				}
			}

			rafRef.current = requestAnimationFrame(animate)
		}

		rafRef.current = requestAnimationFrame(animate)

		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current)
			}

			rafRef.current = null
			lastTsRef.current = null
		}
	}, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform])

	/*
	 * Ativa um tile
	 */
	const activate = useCallback((id: string, columnIndex: number) => {
		activeIdRef.current = id
		hoveredColRef.current = columnIndex
		setActiveId(id)
	}, [])

	/*
	 * Remove o tile ativo
	 */
	const release = useCallback(() => {
		activeIdRef.current = null
		hoveredColRef.current = -1
		setActiveId(null)
	}, [])

	/*
	 * Movimento do mouse
	 */
	const handlePointerMove = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
			const rect = containerRef.current?.getBoundingClientRect()

			if (!rect) return

			/*
			 * Parallax
			 */
			if (parallax > 0 && !reduced) {
				pointerRef.current = {
					x: (event.clientX - rect.left) / rect.width - 0.5,

					y: (event.clientY - rect.top) / rect.height - 0.5,
				}
			}

			/*
			 * Descobre qual tile está sob o mouse
			 */
			const hit = document.elementFromPoint(event.clientX, event.clientY)

			const tile = hit?.closest?.('[data-tile-id]') as HTMLElement | null

			if (!tile) return

			const id = tile.dataset.tileId ?? null

			if (id === activeIdRef.current) {
				return
			}

			activeIdRef.current = id

			hoveredColRef.current = Number(tile.dataset.col)

			setActiveId(id)
		},
		[parallax, reduced],
	)

	/*
	 * Sai da parede
	 */
	const handlePointerLeaveWall = useCallback(() => {
		wallHoveredRef.current = false

		pointerRef.current = {
			x: 0,
			y: 0,
		}

		release()
	}, [release])

	/*
	 * Máscara da parede
	 */
	const maskStyle =
		'radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), ' +
		'linear-gradient(to top, #000 var(--dw-edge), transparent 100%)'

	/*
	 * Variáveis CSS
	 */
	const cssVars = useMemo<DriftWallCSSProperties>(
		() => ({
			'--dw-tile-w': `${tileWidth}px`,
			'--dw-tile-h': `${tileHeight}px`,
			'--dw-gap': `${gap}px`,
			'--dw-radius': `${radius}px`,
			'--dw-lift': `${lift}px`,
			'--dw-dim': dim,
			'--dw-gray': grayscale ? 1 : 0,
			'--dw-overlay': overlayColor,
			'--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,

			perspective: `${perspective}px`,
			perspectiveOrigin: '50% 50%',

			WebkitMaskImage: maskStyle,
			maskImage: maskStyle,

			WebkitMaskComposite: 'source-in',
			maskComposite: 'intersect',

			...style,
		}),
		[
			tileWidth,
			tileHeight,
			gap,
			radius,
			lift,
			dim,
			grayscale,
			overlayColor,
			fade,
			perspective,
			maskStyle,
			style,
		],
	)

	/*
	 * Classes dos tiles
	 */
	const tileClass = cx(
		'group/tile relative block flex-none cursor-pointer outline-none',
		'w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))]',
		'[transform-style:preserve-3d]',
	)

	/*
	 * Conteúdo interno do tile
	 */
	const innerClass = cx(
		'pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#0b0b12]',
		'rounded-[var(--dw-radius)] opacity-[var(--dw-dim)]',
		'[transform:translateZ(0)]',

		'transition-[transform,opacity,box-shadow]',
		'duration-[420ms]',
		'ease-[cubic-bezier(0.22,1,0.36,1)]',

		'group-[.is-active]/tile:opacity-100',
		'group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))]',

		'group-[.is-active]/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)]',

		'group-focus-visible/tile:opacity-100',
		'group-focus-visible/tile:[transform:translateZ(var(--dw-lift))]',

		'group-focus-visible/tile:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7),0_0_0_2px_rgba(255,255,255,0.9)]',
	)

	/*
	 * Imagem
	 */
	const imgClass = cx(
		'block h-full w-full select-none object-cover',

		'[filter:grayscale(var(--dw-gray))_saturate(0.92)]',

		'transition-[filter]',
		'duration-[420ms]',
		'ease-[cubic-bezier(0.22,1,0.36,1)]',

		'group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.05)]',
		'group-focus-visible/tile:[filter:grayscale(0)_saturate(1.05)]',
	)

	/*
	 * Overlay
	 */
	const overlayClass = cx(
		'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.42]',

		'transition-opacity',
		'duration-[420ms]',
		'ease-[cubic-bezier(0.22,1,0.36,1)]',

		'group-[.is-active]/tile:opacity-0',
		'group-focus-visible/tile:opacity-0',
	)

	/*
	 * Renderiza cada tile
	 */
	const renderTile = (item: DriftWallItem, id: string, columnIndex: number) => {
		const inner = (
			<span className={innerClass}>
				<img
					src={item.image}
					alt={item.title ?? ''}
					loading="lazy"
					decoding="async"
					draggable={false}
					className={imgClass}
				/>

				<span className={overlayClass} aria-hidden="true" />
			</span>
		)

		const commonProps = {
			className: cx(tileClass, activeId === id && 'is-active'),
			'data-tile-id': id,
			'data-col': columnIndex,
			onFocus: () => activate(id, columnIndex),
			onBlur: release,
		}

		/*
		 * Tile com link
		 */
		if (item.href) {
			return (
				<a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
					{inner}
				</a>
			)
		}

		/*
		 * Tile sem link
		 */
		return (
			<div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
				{inner}
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			className={cx('relative h-full w-full overflow-hidden', className)}
			style={cssVars}
			onPointerMove={handlePointerMove}
			onPointerEnter={() => {
				wallHoveredRef.current = true
			}}
			onPointerLeave={handlePointerLeaveWall}
			role="group"
			aria-label="Drifting wall of tiles"
		>
			<div
				ref={planeRef}
				className="absolute top-1/2 left-1/2 flex [transform-origin:50%_50%] cursor-pointer flex-row will-change-transform [transform-style:preserve-3d]"
			>
				{columnItems.map((column, columnIndex) => {
					const meta = columnMeta[columnIndex]

					if (!meta) return null

					const copies = Array.from({
						length: meta.copies,
					})

					return (
						<div
							className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
							key={`col-${columnIndex}`}
						>
							<div
								className="flex flex-col will-change-transform [transform-style:preserve-3d]"
								ref={(element) => {
									trackRefs.current[columnIndex] = element
								}}
							>
								{copies.map((_, copyIndex) =>
									column.map((item, itemIndex) =>
										renderTile(item, `${columnIndex}-${copyIndex}-${itemIndex}`, columnIndex),
									),
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default DriftWall
