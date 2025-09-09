"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Stack, generateStackItem, getAnimationDuration } from '../utils/dataStructures';
import { StackItem, AnimationSpeed, ViewMode } from '../types';
import Pancake from './Pancake';

interface StackVisualizationProps {
	animationSpeed: AnimationSpeed;
	onSpeedChange: (speed: AnimationSpeed) => void;
	autoMode: boolean;
	onAutoModeChange: (auto: boolean) => void;
}

export default function StackVisualization({ 
	animationSpeed, 
	onSpeedChange, 
	autoMode, 
	onAutoModeChange 
}: StackVisualizationProps) {
	const [stack] = useState(new Stack<StackItem>());
	const [stackItems, setStackItems] = useState<StackItem[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [operationsCount, setOperationsCount] = useState(0);
	const [exitingItem, setExitingItem] = useState<StackItem | null>(null);
	const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const animationDuration = getAnimationDuration(animationSpeed);

	const handlePush = useCallback(() => {
		setIsProcessing(true);
		const newItem = generateStackItem();
		newItem.animating = true;
		
		stack.push(newItem);
		setStackItems([...stack.toArray()]);
		setOperationsCount(prev => prev + 1);
		
		// Stop animation after duration
		setTimeout(() => {
			newItem.animating = false;
			setStackItems([...stack.toArray()]);
			setIsProcessing(false);
		}, animationDuration);
	}, [isProcessing, stack, animationDuration]);

	const handlePop = useCallback(() => {
		if (isProcessing || stack.isEmpty()) return;
		
		setIsProcessing(true);
		const poppedItem = stack.peek();
		
		if (poppedItem) {
			setExitingItem(poppedItem);
			
			setTimeout(() => {
				stack.pop();
				setStackItems([...stack.toArray()]);
				setExitingItem(null);
				setOperationsCount(prev => prev + 1);
				setIsProcessing(false);
			}, animationDuration);
		}
	}, [isProcessing, stack, animationDuration]);

	const handleClear = () => {
		if (stack.isEmpty()) return;
		
		stack.clear();
		setStackItems([]);
		setExitingItem(null);
		setOperationsCount(0);
		
		if (autoIntervalRef.current) {
			clearInterval(autoIntervalRef.current);
			autoIntervalRef.current = null;
		}
		onAutoModeChange(false);
	};

	// Auto mode logic
	useEffect(() => {
		if (autoMode) {
			autoIntervalRef.current = setInterval(() => {
				if (Math.random() > 0.3 && stackItems.length < 15) {
					handlePush();
				} else if (stackItems.length > 0) {
					handlePop();
				}
			}, animationDuration + 500);
		} else if (autoIntervalRef.current) {
			clearInterval(autoIntervalRef.current);
			autoIntervalRef.current = null;
		}

		return () => {
			if (autoIntervalRef.current) {
				clearInterval(autoIntervalRef.current);
			}
		};
	}, [autoMode, animationDuration, stackItems.length, handlePush, handlePop]);

	const renderControls = () => {
		return (
			<div className="space-y-4">
				{/* Educational Info */}
				<div className="space-y-4 border-b border-border pb-4">
					<div>
						<h3 className="text-lg font-bold text-foreground mb-3">Stack Operations (LIFO)</h3>
						<ul className="space-y-2 text-muted-foreground text-sm">
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								<span><strong>Push:</strong> Add pancake to the top of the stack</span>
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								<span><strong>Pop:</strong> Remove pancake from the top of the stack</span>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-bold text-foreground mb-3">Real-World Examples</h3>
						<ul className="space-y-2 text-muted-foreground text-sm">
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Function call stack in programming
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Undo operations in text editors
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Browser history navigation
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Memory management (stack frames)
							</li>
						</ul>
					</div>
				</div>

				{/* Animation Speed */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-foreground">Animation Speed</label>
					<select 
						value={animationSpeed} 
						onChange={(e) => onSpeedChange(e.target.value as AnimationSpeed)}
						className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
					>
						<option value="slow">Slow</option>
						<option value="medium">Medium</option>
						<option value="fast">Fast</option>
					</select>
				</div>
				
				{/* Auto Mode */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-foreground">Auto Mode</label>
					<button
						onClick={() => onAutoModeChange(!autoMode)}
						className={`w-full p-2 rounded-lg font-medium transition-colors ${
							autoMode 
							? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
							: 'bg-secondary hover:bg-accent hover:text-accent-foreground text-secondary-foreground'
						}`}
					>
						{autoMode ? 'Auto ON' : 'Auto OFF'}
					</button>
				</div>
				
				{/* Manual Controls */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-foreground">Manual Controls</label>
					<div className="space-y-2">
						<button
							onClick={handlePush}
							className="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
						>
							Add Pancake
						</button>
						<button
							onClick={handlePop}
							disabled={stack.isEmpty()}
							className="w-full px-3 py-2 border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary rounded-lg font-medium transition-colors"
						>
							Remove Pancake
						</button>
						<button
							onClick={handleClear}
							disabled={stack.isEmpty()}
							className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
						>
							Clear All
						</button>
					</div>
				</div>

			</div>
		);
	};

	return (
		<div className="w-full h-full flex overflow-hidden gap-2 sm:gap-4 p-2 sm:p-4 min-h-[calc(100vh-6rem)]">
			{/* Left Content Area - Title, Cards, and Visualization stacked */}
			<div className="flex-1 flex flex-col overflow-hidden gap-2 sm:gap-4">
				{/* Top Section - Header and Info Cards */}
				<div className="flex-shrink-0 flex items-center gap-4 px-2">
					{/* Title and Description */}
					<div className="flex-1">
						<h2 className="text-3xl font-bold text-foreground mb-2">Pancake Stack</h2>
						<p className="text-base text-muted-foreground">Last In, First Out (LIFO) - New pancakes go on top, and you can only take from the top</p>
					</div>
					
					{/* Stack Info Cards - Centered next to title/description */}
					<div className="flex gap-4">
						<div className="text-center p-3 bg-background border border-border rounded-lg min-w-[120px]">
							<div className="text-xl font-bold text-foreground">{stack.size()}</div>
							<div className="text-xs text-muted-foreground">Pancakes</div>
						</div>
						<div className="text-center p-3 bg-background border border-border rounded-lg min-w-[120px]">
							<div className="text-lg font-bold text-foreground">{operationsCount}</div>
							<div className="text-xs text-muted-foreground">Operations</div>
						</div>
					</div>
				</div>

				{/* Stack Visualization - Below header */}
				<div className="flex-1 flex justify-center items-center min-h-0">
				{/* Kitchen Scene */}
				<div className="w-full h-full bg-muted/20 rounded-lg p-8 flex justify-center items-center relative overflow-hidden">
					<div className="relative w-full h-full max-w-4xl">
						{/* Kitchen counter/table */}
						<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-4 bg-amber-800 rounded-lg shadow-lg"></div>
						
						{/* Plate */}
						<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-80 h-3 bg-white rounded-full border-2 border-gray-300 shadow-md"></div>
						
						{/* Kitchen background elements */}
						<div className="absolute top-8 left-8 text-4xl opacity-50">🍳</div>
						<div className="absolute top-8 right-8 text-4xl opacity-50">🧈</div>
						<div className="absolute top-16 left-1/4 text-3xl opacity-30">🥛</div>
						<div className="absolute top-20 right-1/4 text-3xl opacity-30">🍯</div>
						
						{/* Pancakes in stack */}
						{stackItems.map((item, index) => (
							<Pancake
								key={item.id}
								item={item}
								stackPosition={index}
								animationDuration={animationDuration}
							/>
						))}
						
						{/* Exiting pancake */}
						{exitingItem && (
							<Pancake
								key={`exiting-${exitingItem.id}`}
								item={exitingItem}
								stackPosition={stackItems.length}
								isExiting={true}
								animationDuration={animationDuration}
							/>
						)}
						
						{/* Empty state */}
						{stack.isEmpty() && !exitingItem && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center text-gray-500 dark:text-gray-400">
									<div className="text-6xl mb-4">🍽️</div>
									<p className="text-xl">Stack is empty</p>
									<p className="text-sm">Add some pancakes to see the stack in action!</p>
								</div>
							</div>
						)}
						
					</div>
				</div>
				</div>
			</div>

			{/* Control Panel - Right Side - Full Height */}
			<div className="w-64 xl:w-72 flex-shrink-0 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border overflow-auto">
				{renderControls()}
			</div>
		</div>
	);
}