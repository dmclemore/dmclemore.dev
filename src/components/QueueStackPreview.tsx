"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PreviewOverlay from "./PreviewOverlay";

export default function QueueStackPreview() {
	const [currentDemo, setCurrentDemo] = useState<'queue' | 'stack'>('queue');
	const [queueItems, setQueueItems] = useState<number[]>([1, 2, 3]);
	const [stackItems, setStackItems] = useState<number[]>([1, 2, 3, 4]);

	// Auto-cycle between queue and stack demos
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentDemo(prev => prev === 'queue' ? 'stack' : 'queue');
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	// Simulate queue operations
	useEffect(() => {
		if (currentDemo !== 'queue') return;
		
		const interval = setInterval(() => {
			setQueueItems(prev => {
				if (prev.length >= 6) {
					// Dequeue (remove from front)
					return prev.slice(1);
				} else {
					// Enqueue (add to back)
					const nextId = Math.max(...prev) + 1;
					return [...prev, nextId];
				}
			});
		}, 1200);
		
		return () => clearInterval(interval);
	}, [currentDemo]);

	// Simulate stack operations
	useEffect(() => {
		if (currentDemo !== 'stack') return;
		
		const interval = setInterval(() => {
			setStackItems(prev => {
				if (prev.length >= 7) {
					// Pop (remove from top)
					return prev.slice(0, -1);
				} else {
					// Push (add to top)
					const nextId = Math.max(...prev) + 1;
					return [...prev, nextId];
				}
			});
		}, 1200);
		
		return () => clearInterval(interval);
	}, [currentDemo]);

	return (
		<div className="w-full h-full bg-muted/30 relative overflow-hidden group">
			<PreviewOverlay />
			
			<AnimatePresence mode="wait">
				{currentDemo === 'queue' ? (
					<motion.div
						key="queue"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						className="w-full h-full flex items-center justify-center"
					>
						{/* Queue Visualization */}
						<div className="relative">
							{/* Security gate */}
							<div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6">
								<div className="w-8 h-12 bg-muted-foreground/60 rounded-sm flex items-center justify-center">
									<div className="text-xs">🚪</div>
								</div>
							</div>
							
							{/* Queue line */}
							<div className="flex items-center gap-3">
								<AnimatePresence>
									{queueItems.map((item, index) => (
										<motion.div
											key={item}
											initial={{ opacity: 0, x: -20, scale: 0.8 }}
											animate={{ 
												opacity: 1, 
												x: 0, 
												scale: 1,
												transition: { delay: index * 0.1 }
											}}
											exit={{ opacity: 0, x: 20, scale: 0.8 }}
											className="relative"
										>
											{/* Stick figure */}
											<div className="w-6 h-6 bg-yellow-200 rounded-full border border-gray-400 flex items-center justify-center text-xs">
												{index === 0 ? '👤' : '😊'}
											</div>
											{/* Shadow */}
											<div className="w-4 h-1 bg-gray-400 opacity-30 rounded-full mx-auto mt-1"></div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
							
							{/* Ground line */}
							<div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-muted-foreground/40 rounded"></div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="stack"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="w-full h-full flex items-center justify-center"
					>
						{/* Stack Visualization */}
						<div className="relative" style={{ transform: 'translateY(15px)' }}>
							{/* Plate */}
							<div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-1 bg-background rounded-full border border-border" style={{ bottom: '-12px' }}></div>
							
							{/* Stack of pancakes */}
							<div className="relative">
								<AnimatePresence>
									{stackItems.map((item, index) => (
										<motion.div
											key={item}
											initial={{ opacity: 0, y: -10, scale: 1.2 }}
											animate={{ 
												opacity: 1, 
												y: 0, 
												scale: 1,
												transition: { 
													type: "spring",
													stiffness: 200,
													damping: 10
												}
											}}
											exit={{ 
												opacity: 0, 
												y: -20, 
												scale: 0.8,
												transition: { duration: 0.3 }
											}}
											className="absolute left-1/2 transform -translate-x-1/2"
											style={{ 
												bottom: `${index * 5 - 9}px`,
												zIndex: stackItems.length - index
											}}
										>
											{/* Pancake */}
											<div 
												className="w-24 h-3 rounded-full border border-amber-600"
												style={{ 
													backgroundColor: `hsl(${30 + (item * 15) % 60}, 70%, ${65 + (index * 3)}%)`
												}}
											>
												{/* Topping */}
												<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-0.5 text-xs">
													{['🫐', '🍓', '🍫', '🧈', '🍯', '🥜', '🍌'][item % 7]}
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

		</div>
	);
}