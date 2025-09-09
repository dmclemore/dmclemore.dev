"use client";

import { StackItem } from '../types';

interface PancakeProps {
	item: StackItem;
	stackPosition: number;
	isExiting?: boolean;
	animationDuration: number;
}

export default function Pancake({ item, stackPosition, isExiting = false, animationDuration }: PancakeProps) {
	const getPancakeVariant = (variant: number) => {
		const variants = {
			1: { color: "#D4A574", topping: "🫐", name: "Blueberry" },      // Blueberry
			2: { color: "#E6B800", topping: "🍓", name: "Strawberry" },     // Strawberry  
			3: { color: "#CD853F", topping: "🍫", name: "Chocolate Chip" }, // Chocolate chip
			4: { color: "#F4E4BC", topping: "🧈", name: "Butter" },         // Butter
			5: { color: "#DEB887", topping: "🍯", name: "Honey" },          // Honey
			6: { color: "#F5DEB3", topping: "🥜", name: "Pecan" },          // Pecan
			7: { color: "#FFE4B5", topping: "🍌", name: "Banana" },         // Banana
			8: { color: "#F0E68C", topping: "🥥", name: "Coconut" }         // Coconut
		};
		
		return variants[variant as keyof typeof variants] || variants[1];
	};

	const variant = getPancakeVariant(item.variant);
	const bottomOffset = 44 + (stackPosition * 24); // Start on plate (44px) + stack height (increased spacing for thicker pancakes)
	
	const exitClass = isExiting ? "opacity-0 scale-90 -translate-y-40" : "";
	const animatingClass = item.animating ? "animate-bounce" : "";

	return (
		<div 
			className={`absolute transition-all duration-700 ease-out ${exitClass} ${animatingClass}`}
			style={{ 
				bottom: `${bottomOffset}px`,
				left: "50%",
				transform: "translateX(-50%)",
				transitionDuration: `${animationDuration}ms`
			}}
		>
			{/* Pancake */}
			<div className="relative">
				{/* Main pancake body */}
				<div 
					className="w-96 h-8 rounded-full border-2 border-amber-800 shadow-lg relative overflow-hidden"
					style={{ backgroundColor: variant.color }}
				>
					{/* Pancake texture lines */}
					<div className="absolute inset-0 opacity-20">
						<div className="w-full h-0.5 bg-amber-900 absolute top-1"></div>
						<div className="w-full h-0.5 bg-amber-900 absolute top-2.5"></div>
						<div className="w-full h-0.5 bg-amber-900 absolute bottom-1"></div>
					</div>
					
					{/* Highlight to make it look fluffy */}
					<div className="absolute top-0 left-2 w-6 h-1 bg-white opacity-40 rounded-full"></div>
				</div>
				
				{/* Topping */}
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
					{variant.topping}
				</div>
				
				{/* Small butter pat if it's a butter pancake */}
				{variant.name === "Butter" && (
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-4 bg-yellow-200 rounded-sm opacity-80"></div>
				)}
			</div>
			
			{/* Pancake label for educational purposes */}
			<div className="absolute -right-24 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
				{variant.name}
			</div>
		</div>
	);
}