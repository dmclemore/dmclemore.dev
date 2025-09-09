"use client";

import { ViewMode } from '../types';

interface ChoiceScreenProps {
	onNavigate: (view: ViewMode) => void;
}

export default function ChoiceScreen({ onNavigate }: ChoiceScreenProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full bg-background p-4">
			<div className="text-center p-6 sm:p-8 max-w-4xl mx-auto">
				<div className="bg-muted/20 rounded-lg p-8 mb-10">
					<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
						Choose Your Data Structure
					</h1>
					
					<p className="text-muted-foreground mb-8 leading-relaxed text-lg sm:text-xl max-w-3xl mx-auto">
						Select between Queue (First In, First Out) or Stack (Last In, First Out) 
						to explore how these fundamental data structures work through interactive visualizations.
					</p>

					<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
						<button
							onClick={() => onNavigate('queue')}
							className="group p-8 bg-background rounded-2xl border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
						>
							<div className="text-6xl mb-4">🚶‍♂️</div>
							<h3 className="text-2xl font-bold text-foreground mb-3">
								Queue Demo
							</h3>
							<p className="text-muted-foreground mb-4 text-lg">
								First In, First Out (FIFO)
							</p>
							<p className="text-sm text-muted-foreground mb-4">
								Watch people wait in line at a security checkpoint. 
								The first person to arrive is the first to be served.
							</p>
							<div className="mt-6 text-primary font-semibold group-hover:text-primary/90 transition-colors">
								Try Queue Demo →
							</div>
						</button>

						<button
							onClick={() => onNavigate('stack')}
							className="group p-8 bg-background rounded-2xl border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
						>
							<div className="text-6xl mb-4">🥞</div>
							<h3 className="text-2xl font-bold text-foreground mb-3">
								Stack Demo
							</h3>
							<p className="text-muted-foreground mb-4 text-lg">
								Last In, First Out (LIFO)
							</p>
							<p className="text-sm text-muted-foreground mb-4">
								Stack pancakes and watch them pile up. 
								The last pancake added is the first one you can take.
							</p>
							<div className="mt-6 text-primary font-semibold group-hover:text-primary/90 transition-colors">
								Try Stack Demo →
							</div>
						</button>
					</div>

					<div className="grid md:grid-cols-2 gap-8 text-left">
						<div>
							<h3 className="font-bold text-foreground mb-4 text-center text-lg">Queue Operations</h3>
							<ul className="space-y-2 text-muted-foreground">
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Enqueue (add to back)
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Dequeue (remove from front)
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Print job scheduling
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Breadth-first search
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Task processing systems
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-bold text-foreground mb-4 text-center text-lg">Stack Operations</h3>
							<ul className="space-y-2 text-muted-foreground">
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Push (add to top)
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Pop (remove from top)
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Function call management
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Undo/Redo operations
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Browser history navigation
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}