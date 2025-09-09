"use client";

interface PreviewOverlayProps {
	text?: string;
}

export default function PreviewOverlay({ text = "Try Interactive Demo" }: PreviewOverlayProps) {
	return (
		<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
			<div className="text-center text-white">
				<div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
					<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z"/>
					</svg>
				</div>
				<p className="text-sm font-medium">{text}</p>
			</div>
		</div>
	);
}