import { QueueItem, StackItem } from '../types';

export class Queue<T> {
	private items: T[] = [];

	enqueue(item: T): void {
		this.items.push(item);
	}

	dequeue(): T | undefined {
		return this.items.shift();
	}

	peek(): T | undefined {
		return this.items[0];
	}

	size(): number {
		return this.items.length;
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	clear(): void {
		this.items = [];
	}

	toArray(): T[] {
		return [...this.items];
	}
}

export class Stack<T> {
	private items: T[] = [];

	push(item: T): void {
		this.items.push(item);
	}

	pop(): T | undefined {
		return this.items.pop();
	}

	peek(): T | undefined {
		return this.items[this.items.length - 1];
	}

	size(): number {
		return this.items.length;
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	clear(): void {
		this.items = [];
	}

	toArray(): T[] {
		return [...this.items];
	}
}

export const generateQueueItem = (): QueueItem => ({
	id: `person-${Date.now()}-${Math.random()}`,
	type: 'person',
	variant: Math.floor(Math.random() * 6) + 1, // 6 different stick figure variants
	animating: false
});

export const generateStackItem = (): StackItem => ({
	id: `pancake-${Date.now()}-${Math.random()}`,
	type: 'pancake',
	variant: Math.floor(Math.random() * 8) + 1, // 8 different pancake variants
	animating: false
});

export const getAnimationDuration = (speed: 'slow' | 'medium' | 'fast'): number => {
	switch (speed) {
		case 'slow': return 1000;
		case 'medium': return 600;
		case 'fast': return 300;
		default: return 600;
	}
};