"use client";

import { useState } from "react";
import { ProjectNavigation } from "@/components/project-navigation";
import { ChevronDown, ChevronUp, Database, Terminal, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import the actual generated data
import ecommerceData from "../../../data/ecommerce_demo.json";
import healthcareData from "../../../data/healthcare_demo.json";
import financeData from "../../../data/finance_demo.json";

const sampleDatasets = [
	{
		id: "e-commerce",
		title: "E-Commerce Customer Data",
		description: "Realistic customer profiles for online retail analysis",
		industry: "E-Commerce",
		command:
			'python main.py --fields "customer_id:string:uuid,name:string,email:string,age:integer:18:70,total_spent:float:25:2500,category_preference:categorical:electronics|clothing|books|home" --count 25 --industry "e-commerce"',
		data: ecommerceData,
	},
	{
		id: "healthcare",
		title: "Healthcare Patient Records",
		description: "Anonymized patient data for medical research and training",
		industry: "Healthcare",
		command:
			'python main.py --fields "patient_id:string:uuid,age:integer:18:85,diagnosis:categorical:flu|covid|diabetes|hypertension|allergies,visit_cost:float:50:800,insurance_type:categorical:private|medicare|medicaid" --count 25 --industry "healthcare"',
		data: healthcareData,
	},
	{
		id: "finance",
		title: "Financial Transaction Data",
		description: "Synthetic transaction records for financial modeling",
		industry: "Finance",
		command:
			'python main.py --fields "transaction_id:string:uuid,account_holder:string,amount:float:10:5000,transaction_type:categorical:deposit|withdrawal|transfer|payment,risk_score:float:0:1" --count 25 --industry "finance"',
		data: financeData,
	},
];

interface CollapsibleDatasetProps {
	dataset: (typeof sampleDatasets)[0];
	isOpen: boolean;
	onToggle: () => void;
}

function CollapsibleDataset({
	dataset,
	isOpen,
	onToggle,
}: CollapsibleDatasetProps) {
	return (
		<div
			className="border border-border rounded-lg overflow-hidden bg-card cursor-pointer hover:bg-muted/20 transition-colors"
			onClick={onToggle}
		>
			{/* Header */}
			<div className="p-6 pb-4">
				<div className="flex items-center gap-3 mb-2">
					<Database className="h-5 w-5 text-primary" />
					<h3 className="text-xl font-semibold text-foreground">
						{dataset.title}
					</h3>
					<span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
						{dataset.industry}
					</span>
				</div>
				<p className="text-muted-foreground mb-3">{dataset.description}</p>
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
					<Terminal className="h-4 w-4" />
					<code className="bg-muted px-2 py-1 rounded text-xs font-mono">
						{dataset.command.split(" ").slice(0, 4).join(" ")}...
					</code>
				</div>
			</div>

			{/* Visual Arrow Indicator */}
			<div className="flex items-center justify-center pb-4">
				{isOpen ? (
					<ChevronUp className="h-5 w-5 text-muted-foreground transition-colors" />
				) : (
					<ChevronDown className="h-5 w-5 text-muted-foreground transition-colors" />
				)}
			</div>

			{/* Collapsible Content */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="px-6 pb-6 border-t border-border">
							<div className="mt-4">
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-border">
												{dataset.data.length > 0 &&
													Object.keys(dataset.data[0]).map(key => (
														<th
															key={key}
															className="text-left p-3 font-medium text-muted-foreground"
														>
															{key
																.replace("_", " ")
																.replace(/\b\w/g, l => l.toUpperCase())}
														</th>
													))}
											</tr>
										</thead>
										<tbody>
											{dataset.data.map((record: any, index: number) => (
												<tr
													key={index}
													className="border-b border-border/50 hover:bg-muted/20"
												>
													{Object.values(record).map(
														(value: any, cellIndex: number) => (
															<td
																key={cellIndex}
																className="p-3 text-foreground"
															>
																{typeof value === "number"
																	? Number.isInteger(value)
																		? value
																		: value.toFixed(2)
																	: String(value)}
															</td>
														)
													)}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default function DataGenerationAppPage() {
	const [openDatasets, setOpenDatasets] = useState<Set<string>>(new Set());

	const toggleDataset = (id: string) => {
		setOpenDatasets(prev => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	return (
		<div className="min-h-screen bg-background">
			<ProjectNavigation
				projectTitle="AI-Powered Synthetic Data Generator"
				githubUrl="https://github.com/dmclemore/data-generation-app"
				showStartOver={false}
				showTitle={true}
			/>

			<main className="min-h-[calc(100vh-6rem)] py-8">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header Section */}
					<div className="text-center mb-12">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h1 className="text-4xl font-bold text-foreground mb-4">
								Sample Generated Datasets
							</h1>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
								Explore realistic synthetic data generated using advanced AI
								techniques. Each dataset demonstrates different field types,
								industry contexts, and data patterns while maintaining
								uniqueness and avoiding duplicates.
							</p>
							<div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-green-500" />
									<span>OpenAI-Powered Generation</span>
								</div>
								<div className="flex items-center gap-2">
									<Database className="h-4 w-4 text-blue-500" />
									<span>Intelligent Duplicate Detection</span>
								</div>
								<div className="flex items-center gap-2">
									<Terminal className="h-4 w-4 text-purple-500" />
									<span>CLI Tool</span>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Sample Datasets */}
					<div className="space-y-6">
						{sampleDatasets.map((dataset, index) => (
							<motion.div
								key={dataset.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<CollapsibleDataset
									dataset={dataset}
									isOpen={openDatasets.has(dataset.id)}
									onToggle={() => toggleDataset(dataset.id)}
								/>
							</motion.div>
						))}
					</div>

					{/* Footer Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="mt-16 text-center"
					>
						<div className="bg-muted/30 rounded-lg p-8">
							<h3 className="text-xl font-semibold text-foreground mb-4">
								About This Tool
							</h3>
							<p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
								This Python CLI application generates synthetic datasets using
								OpenAI's advanced language models. It features intelligent
								duplicate detection using fuzzy matching algorithms,
								configurable batch processing for optimal performance, and
								industry-specific context generation for realistic data
								patterns. The tool supports multiple output formats (JSON, CSV,
								Parquet) and can generate up to 50,000 records with
								sophisticated uniqueness controls and memory management.
							</p>
						</div>
					</motion.div>
				</div>
			</main>
		</div>
	);
}
