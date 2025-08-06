"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
}) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	return (
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="fixed inset-0 z-50 flex items-center justify-center"
					onClick={onClose}
				>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					/>

					{/* Modal Content */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.8, opacity: 0, y: 20 }}
						transition={{
							duration: 0.4,
							ease: [0.4, 0.0, 0.2, 1],
						}}
						className="relative w-full h-full max-w-7xl max-h-[95vh] bg-background rounded-lg shadow-2xl overflow-hidden m-4 flex flex-col"
						onClick={e => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-background/95 backdrop-blur-sm flex-shrink-0">
							<h2 className="text-xl sm:text-2xl font-bold text-foreground">
								{title}
							</h2>
							<button
								onClick={onClose}
								className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
								aria-label="Close modal"
							>
								<X className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground" />
							</button>
						</div>

						{/* Content */}
						<div className="flex-1 overflow-hidden bg-background min-h-0">
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProjectModal;
