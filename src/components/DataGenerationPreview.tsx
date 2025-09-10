"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Type for generated data records
type GeneratedDataRecord = Record<string, string | number | boolean>;

export default function DataGenerationPreview() {
	const [currentStep, setCurrentStep] = useState(0);
	const [typedCommand, setTypedCommand] = useState("");
	const [generatedData, setGeneratedData] = useState<GeneratedDataRecord[]>([]);

	// Sample commands to cycle through
	const commands = [
		'python main.py --fields "name:string,age:integer:18:65,salary:float:30000:120000" --count 5 --industry "tech"',
		'python main.py --fields "id:string:uuid,product:string,price:float:10:500" --count 5 --industry "retail"',
		'python main.py --fields "patient_id:string,diagnosis:categorical:flu|covid|allergies" --count 5 --industry "healthcare"'
	];

	// Sample generated data for each command
	const sampleData = [
		[
			{ name: "Sarah Chen", age: 28, salary: 85000 },
			{ name: "Marcus Rodriguez", age: 34, salary: 95000 },
			{ name: "Emily Johnson", age: 26, salary: 72000 },
			{ name: "David Kim", age: 31, salary: 88000 },
			{ name: "Jessica Taylor", age: 29, salary: 91000 }
		],
		[
			{ id: "a1b2c3d4", product: "Wireless Headphones", price: 129.99 },
			{ id: "e5f6g7h8", product: "Smart Watch", price: 299.00 },
			{ id: "i9j0k1l2", product: "Bluetooth Speaker", price: 79.99 },
			{ id: "m3n4o5p6", product: "Phone Case", price: 24.99 },
			{ id: "q7r8s9t0", product: "USB Cable", price: 15.99 }
		],
		[
			{ patient_id: "P001", diagnosis: "flu" },
			{ patient_id: "P002", diagnosis: "covid" },
			{ patient_id: "P003", diagnosis: "allergies" },
			{ patient_id: "P004", diagnosis: "flu" },
			{ patient_id: "P005", diagnosis: "allergies" }
		]
	];

	// Main animation cycle
	useEffect(() => {
		const fullCycle = () => {
			// Reset state
			setTypedCommand("");
			setGeneratedData([]);

			// Type command
			const command = commands[currentStep];
			let charIndex = 0;
			
			const typeInterval = setInterval(() => {
				if (charIndex <= command.length) {
					setTypedCommand(command.slice(0, charIndex));
					charIndex++;
				} else {
					clearInterval(typeInterval);
					
					// Show generating message
					setTimeout(() => {
						// Simulate data generation - show all at once
						const data = sampleData[currentStep] || [];
						setGeneratedData(data);
						
						// Wait before next cycle
						setTimeout(() => {
							setCurrentStep((prev) => (prev + 1) % commands.length);
						}, 3000);
					}, 800);
				}
			}, 50);
		};

		fullCycle();
	}, [currentStep]);


	return (
		<div className="w-full h-full bg-gray-900 text-green-400 font-mono text-xs p-4 overflow-hidden relative">
			{/* Terminal Header */}
			<div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
				<div className="flex gap-1">
					<div className="w-2 h-2 bg-red-500 rounded-full"></div>
					<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
					<div className="w-2 h-2 bg-green-500 rounded-full"></div>
				</div>
				<span className="text-gray-400 text-xs">data-generation-app</span>
			</div>

			{/* Command Line */}
			<div className="mb-4">
				<span className="text-blue-400">$ </span>
				<span className="text-white">{typedCommand}</span>
				<motion.span 
					className="inline-block w-2 h-4 bg-green-400 ml-1"
					animate={{ opacity: [1, 0, 1] }}
					transition={{ duration: 1, repeat: Infinity }}
				/>
			</div>

			{/* Generation Status */}
			{typedCommand.length > 50 && generatedData.length === 0 && (
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-yellow-400 mb-2"
				>
					🚀 Generating realistic data using OpenAI...
				</motion.div>
			)}

			{/* Generated Data */}
			<AnimatePresence>
				{generatedData.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-2"
					>
						<div className="text-green-400 mb-2">
							✅ Generated {generatedData.length} unique records:
						</div>
						
						{/* JSON Output */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="bg-gray-800 rounded p-3 text-xs font-mono overflow-auto max-h-40"
						>
							<pre className="text-gray-300 whitespace-pre-wrap">
								{JSON.stringify(generatedData, null, 2)}
							</pre>
						</motion.div>

						<motion.div 
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
							className="text-green-400 mt-2"
						>
							💾 Data saved to output file
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}