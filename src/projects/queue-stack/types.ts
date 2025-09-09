export type ViewMode = 'start' | 'choice' | 'queue' | 'stack';

export type AnimationSpeed = 'slow' | 'medium' | 'fast';

export interface QueueItem {
	id: string;
	type: 'person';
	variant: number; // Different stick figure variants
	animating: boolean;
}

export interface StackItem {
	id: string;
	type: 'pancake';
	variant: number; // Different pancake toppings/colors
	animating: boolean;
}

export interface VisualizerState {
	currentView: ViewMode;
	animationSpeed: AnimationSpeed;
	autoMode: boolean;
	operationsCount: number;
}

export interface QueueState {
	items: QueueItem[];
	isProcessing: boolean;
}

export interface StackState {
	items: StackItem[];
	isProcessing: boolean;
}