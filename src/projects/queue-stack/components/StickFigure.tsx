"use client";

import { QueueItem } from '../types';

interface StickFigureProps {
	item: QueueItem;
	position: number;
	snakingPosition?: { x: number; y: number };
	isExiting?: boolean;
	animationDuration: number;
}

export default function StickFigure({ item, position, snakingPosition, isExiting = false, animationDuration }: StickFigureProps) {
	const getStickFigureVariant = (variant: number) => {
		const baseStyle = "transition-all ease-in-out";
		const positionStyle = `transform: translateX(${position * 80}px)`;
		
		// Different stick figure variants with hats, poses, etc.
		const variants = {
			1: { hat: "🎩", shirt: "#3B82F6" }, // Blue shirt with top hat
			2: { hat: "🧢", shirt: "#EF4444" }, // Red shirt with cap
			3: { hat: "👒", shirt: "#10B981" }, // Green shirt with sun hat
			4: { hat: "🎯", shirt: "#F59E0B" }, // Yellow shirt with beret
			5: { hat: "🦆", shirt: "#8B5CF6" }, // Purple shirt with duck (quirky)
			6: { hat: "🎪", shirt: "#EC4899" }  // Pink shirt with circus theme
		};
		
		const config = variants[variant as keyof typeof variants] || variants[1];
		
		return {
			style: `${baseStyle}; ${positionStyle}; animation-duration: ${animationDuration}ms;`,
			hat: config.hat,
			shirtColor: config.shirt
		};
	};

	const variant = getStickFigureVariant(item.variant);
	
	const exitClass = isExiting ? "opacity-0 scale-75 translate-x-full" : "";
	const animatingClass = item.animating ? "animate-bounce" : "";

	// Use snaking position if provided, otherwise fall back to linear positioning
	const positionStyle = snakingPosition 
		? { 
			left: `${snakingPosition.x}px`,
			top: `${snakingPosition.y}px`,
			transitionDuration: `${animationDuration}ms`
		}
		: { 
			left: `${position * 80 + 40}px`,
			bottom: '0px',
			transitionDuration: `${animationDuration}ms`
		};

	return (
		<div 
			className={`absolute transition-all duration-500 ease-in-out ${exitClass} ${animatingClass}`}
			style={positionStyle}
		>
			{/* Stick figure body */}
			<div className="relative">
				{/* Hat */}
				<div className="text-2xl absolute -top-8 left-1/2 transform -translate-x-1/2">
					{variant.hat}
				</div>
				
				{/* Head */}
				<div className="w-6 h-6 rounded-full bg-yellow-200 border-2 border-gray-800 mx-auto mb-1">
					{/* Eyes */}
					<div className="flex justify-center items-center h-full">
						<div className="w-1 h-1 bg-black rounded-full mx-1"></div>
						<div className="w-1 h-1 bg-black rounded-full mx-1"></div>
					</div>
				</div>
				
				{/* Body */}
				<div className="w-1 h-8 mx-auto mb-1" style={{ backgroundColor: variant.shirtColor }}>
				</div>
				
				{/* Arms */}
				<div className="relative">
					<div className="absolute w-6 h-1 bg-yellow-200 top-2 left-1/2 transform -translate-x-1/2 -translate-y-6"></div>
				</div>
				
				{/* Legs */}
				<div className="relative">
					<div className="absolute w-1 h-6 bg-yellow-200 left-1/2 transform -translate-x-2"></div>
					<div className="absolute w-1 h-6 bg-yellow-200 left-1/2"></div>
				</div>
			</div>
			
			{/* Shadow */}
			<div className="absolute bottom-0 w-8 h-1 bg-gray-400/30 rounded-full left-1/2 transform -translate-x-1/2 translate-y-1"></div>
		</div>
	);
}