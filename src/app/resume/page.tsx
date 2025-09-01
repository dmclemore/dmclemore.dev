"use client";

import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ResumePage() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = "/Desmond_McLemore_Software_Engineer_Resume.pdf";
		link.download = "Desmond_McLemore_Software_Engineer_Resume.pdf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation Header */}
			<nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="flex-shrink-0"
						>
							<Link
								href="/"
								className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								<ArrowLeft className="h-4 w-4" />
								<span>Back to Portfolio</span>
							</Link>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="absolute left-1/2 transform -translate-x-1/2 hidden md:block"
						>
							<h1 className="text-lg font-semibold text-foreground">Resume</h1>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="hidden md:block"
						>
							<button
								onClick={handleDownload}
								className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg text-sm font-medium"
							>
								<Download className="h-4 w-4" />
								<span>Download PDF</span>
							</button>
						</motion.div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="pt-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
					{isMobile ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center bg-muted/30 rounded-lg p-8 border border-border"
						>
							<Download className="h-16 w-16 text-primary mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-foreground mb-4">
								Resume Download
							</h2>
							<p className="text-muted-foreground mb-6">
								For the best viewing experience on mobile, please download the
								PDF to view in your preferred PDF reader.
							</p>
							<button
								onClick={handleDownload}
								className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg font-medium"
							>
								<Download className="h-5 w-5" />
								<span>Download Resume PDF</span>
							</button>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white rounded-lg shadow-lg overflow-hidden"
						>
							<iframe
								src="/Desmond_McLemore_Software_Engineer_Resume.pdf"
								width="100%"
								height="800px"
								className="border-0"
								title="Desmond McLemore Resume"
							/>
						</motion.div>
					)}
				</div>
			</main>
		</div>
	);
}
