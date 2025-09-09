"use client";

import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ViewMode, AnimationSpeed } from './types';
import StartScreen from './components/StartScreen';
import ChoiceScreen from './components/ChoiceScreen';
import QueueVisualization from './components/QueueVisualization';
import StackVisualization from './components/StackVisualization';

interface QueueStackVisualizerProps {
	onGameStateChange?: (gameState: ViewMode) => void;
}

interface QueueStackVisualizerRef {
	switchView: () => void;
}

const QueueStackVisualizer = forwardRef<QueueStackVisualizerRef, QueueStackVisualizerProps>(({ onGameStateChange }, ref) => {
	const [currentView, setCurrentView] = useState<ViewMode>('start');
	const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('medium');
	const [autoMode, setAutoMode] = useState(false);

	// Notify parent component of game state changes
	useEffect(() => {
		onGameStateChange?.(currentView);
	}, [currentView, onGameStateChange]);

	const handleNavigate = useCallback((view: ViewMode) => {
		setCurrentView(view);
		// Reset auto mode when navigating to start or choice screens
		if (view === 'start' || view === 'choice') {
			setAutoMode(false);
		}
	}, []);

	const handleStart = useCallback(() => {
		setCurrentView('choice');
	}, []);

	const switchView = useCallback(() => {
		if (currentView === 'queue') {
			setCurrentView('stack');
		} else if (currentView === 'stack') {
			setCurrentView('queue');
		}
	}, [currentView]);

	useImperativeHandle(ref, () => ({
		switchView,
	}), [switchView]);

	const renderCurrentView = () => {
		switch (currentView) {
			case 'start':
				return <StartScreen onStart={handleStart} />;
			case 'choice':
				return <ChoiceScreen onNavigate={handleNavigate} />;
			case 'queue':
				return (
					<QueueVisualization
						animationSpeed={animationSpeed}
						onSpeedChange={setAnimationSpeed}
						autoMode={autoMode}
						onAutoModeChange={setAutoMode}
					/>
				);
			case 'stack':
				return (
					<StackVisualization
						animationSpeed={animationSpeed}
						onSpeedChange={setAnimationSpeed}
						autoMode={autoMode}
						onAutoModeChange={setAutoMode}
					/>
				);
			default:
				return <StartScreen onStart={handleStart} />;
		}
	};

	return (
		<div className="w-full min-h-screen">
			{renderCurrentView()}
		</div>
	);
});

QueueStackVisualizer.displayName = 'QueueStackVisualizer';

export default QueueStackVisualizer;