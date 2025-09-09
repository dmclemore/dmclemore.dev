"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Queue, generateQueueItem, getAnimationDuration } from '../utils/dataStructures';
import { QueueItem, AnimationSpeed, ViewMode } from '../types';
import StickFigure from './StickFigure';

interface QueueVisualizationProps {
	animationSpeed: AnimationSpeed;
	onSpeedChange: (speed: AnimationSpeed) => void;
	autoMode: boolean;
	onAutoModeChange: (auto: boolean) => void;
}

export default function QueueVisualization({ 
	animationSpeed, 
	onSpeedChange, 
	autoMode, 
	onAutoModeChange 
}: QueueVisualizationProps) {
	const [queue] = useState(new Queue<QueueItem>());
	const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [operationsCount, setOperationsCount] = useState(0);
	const [exitingItem, setExitingItem] = useState<QueueItem | null>(null);
	const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const animationDuration = getAnimationDuration(animationSpeed);

	// Calculate snaking queue positions starting from security door at top left
	const getSnakingPosition = (index: number, containerWidth = 1000, containerHeight = 600) => {
		const personSpacing = 80; // space between people horizontally
		const rowSpacing = 120; // space between rows (vertical) - increased for no overlap
		const edgeMargin = 40; // margin from container edges
		
		const usableWidth = containerWidth - (edgeMargin * 2);
		const peoplePerRow = Math.floor(usableWidth / personSpacing);
		
		// Account for transition positions at row ends
		const positionsPerSection = peoplePerRow + 1; // +1 for transition person going south
		const section = Math.floor(index / positionsPerSection);
		const posInSection = index % positionsPerSection;
		
		let x, y;
		
		if (posInSection < peoplePerRow) {
			// Regular positions within the row
			if (section % 2 === 0) {
				// Even sections: left to right
				x = edgeMargin + (posInSection * personSpacing);
			} else {
				// Odd sections: right to left (snaking back)
				x = edgeMargin + ((peoplePerRow - 1 - posInSection) * personSpacing);
			}
			y = 80 + (section * rowSpacing);
		} else {
			// Transition position - person goes south at end of row
			if (section % 2 === 0) {
				// End of left-to-right row - transition at right edge
				x = edgeMargin + ((peoplePerRow - 1) * personSpacing);
			} else {
				// End of right-to-left row - transition at left edge
				x = edgeMargin;
			}
			y = 80 + (section * rowSpacing) + (rowSpacing / 2); // Halfway to next row
		}
		
		return { x, y };
	};


	const handleEnqueue = useCallback(() => {
		setIsProcessing(true);
		const newItem = generateQueueItem();
		newItem.animating = true;
		
		queue.enqueue(newItem);
		setQueueItems([...queue.toArray()]);
		setOperationsCount(prev => prev + 1);
		
		// Stop animation after duration
		setTimeout(() => {
			newItem.animating = false;
			setQueueItems([...queue.toArray()]);
			setIsProcessing(false);
		}, animationDuration);
	}, [isProcessing, queue, animationDuration]);

	const handleDequeue = useCallback(() => {
		if (queue.isEmpty()) return;
		
		setIsProcessing(true);
		const dequeuedItem = queue.peek();
		
		if (dequeuedItem) {
			setExitingItem(dequeuedItem);
			
			setTimeout(() => {
				queue.dequeue();
				setQueueItems([...queue.toArray()]);
				setExitingItem(null);
				setOperationsCount(prev => prev + 1);
				setIsProcessing(false);
			}, animationDuration);
		}
	}, [isProcessing, queue, animationDuration]);

	const handleClear = () => {
		if (queue.isEmpty()) return;
		
		queue.clear();
		setQueueItems([]);
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
				if (Math.random() > 0.3 && queueItems.length < 10) {
					handleEnqueue();
				} else if (queueItems.length > 0) {
					handleDequeue();
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
	}, [autoMode, animationDuration, queueItems.length, handleEnqueue, handleDequeue]);

	const renderControls = () => {
		return (
			<div className="space-y-4">
				{/* Educational Info */}
				<div className="space-y-4 border-b border-border pb-4">
					<div>
						<h3 className="text-lg font-bold text-foreground mb-3">Queue Operations (FIFO)</h3>
						<ul className="space-y-2 text-muted-foreground text-sm">
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								<span><strong>Enqueue:</strong> Add person to the back of the line</span>
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								<span><strong>Dequeue:</strong> Remove person from the front of the line</span>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-bold text-foreground mb-3">Real-World Examples</h3>
						<ul className="space-y-2 text-muted-foreground text-sm">
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Print job queues in computers
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Task scheduling in operating systems
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Breadth-first search algorithms
							</li>
							<li className="flex items-start">
								<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5"></span>
								Request handling in web servers
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
							onClick={handleEnqueue}
							className="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
						>
							Add Person
						</button>
						<button
							onClick={handleDequeue}
							disabled={queue.isEmpty()}
							className="w-full px-3 py-2 border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary rounded-lg font-medium transition-colors"
						>
							Remove Person
						</button>
						<button
							onClick={handleClear}
							disabled={queue.isEmpty()}
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
						<h2 className="text-3xl font-bold text-foreground mb-2">Security Checkpoint Queue</h2>
						<p className="text-base text-muted-foreground">First In, First Out (FIFO) - People enter the back of the line and exit from the front</p>
					</div>
					
					{/* Queue Info Cards - Centered next to title/description */}
					<div className="flex gap-4">
						<div className="text-center p-3 bg-background border border-border rounded-lg min-w-[120px]">
							<div className="text-xl font-bold text-foreground">{queue.size()}</div>
							<div className="text-xs text-muted-foreground">People in Line</div>
						</div>
						<div className="text-center p-3 bg-background border border-border rounded-lg min-w-[120px]">
							<div className="text-lg font-bold text-foreground">{operationsCount}</div>
							<div className="text-xs text-muted-foreground">Operations</div>
						</div>
					</div>
				</div>

				{/* Queue Visualization - Below header */}
				<div className="flex-1 flex justify-center items-center min-h-0">
				{/* Security Checkpoint Scene */}
				<div className="w-full h-full bg-muted/20 rounded-lg p-8 flex justify-center items-center relative overflow-hidden">
					<div className="relative w-full h-full max-w-4xl">
						{/* Ground */}
						<div className="absolute bottom-0 w-full h-2 bg-gray-400 rounded"></div>
						
						{/* Security Gate - Same level as start of line, further to the left - Only show when queue has items */}
						{!queue.isEmpty() && (
							<div className="absolute w-24 h-32 bg-gray-600 rounded-lg flex items-center justify-center" style={{left: '-50px', top: `${80 - 12}px`}}>
								<div className="text-lg">🚪 Security</div>
								<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
									Exit Here
								</div>
							</div>
						)}

						{/* Snaking Queue Path */}
						<div className="absolute inset-8">
							
							{/* Stick figures in queue */}
							{queueItems.map((item, index) => (
								<StickFigure
									key={item.id}
									item={item}
									position={index}
									snakingPosition={getSnakingPosition(index)}
									animationDuration={animationDuration}
								/>
							))}
							
							{/* Exiting stick figure */}
							{exitingItem && (
								<StickFigure
									key={`exiting-${exitingItem.id}`}
									item={exitingItem}
									position={queueItems.length}
									snakingPosition={getSnakingPosition(queueItems.length)}
									isExiting={true}
									animationDuration={animationDuration}
								/>
							)}
						</div>
						
						{/* Empty state */}
						{queue.isEmpty() && !exitingItem && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center text-gray-500 dark:text-gray-400">
									<div className="text-6xl mb-4">🚶‍♂️</div>
									<p className="text-xl">Queue is empty</p>
									<p className="text-sm">Add some people to see the queue in action!</p>
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