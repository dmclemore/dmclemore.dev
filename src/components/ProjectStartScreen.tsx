import React from "react";

interface ProjectStartScreenProps {
	title: string;
	description: string;
	features: string[];
	technologies: string[];
	buttonText: string;
	onStart: () => void;
}

const ProjectStartScreen: React.FC<ProjectStartScreenProps> = ({ 
	title, 
	description, 
	features, 
	technologies, 
	buttonText, 
	onStart 
}) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] bg-background p-4">
			<div className="text-center p-6 sm:p-8 max-w-4xl mx-auto">
				<div className="bg-muted/20 rounded-lg p-8 mb-10">
					<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
						{title}
					</h1>
					
					<p className="text-muted-foreground mb-8 leading-relaxed text-lg sm:text-xl max-w-3xl mx-auto">
						{description}
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
						<div>
							<h3 className="font-bold text-foreground mb-4 text-center text-lg">Features</h3>
							<ul className="space-y-2 text-muted-foreground">
								{features.map((feature, index) => (
									<li key={index} className="flex items-center">
										<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
										{feature}
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="font-bold text-foreground mb-4 text-center text-lg">Technologies</h3>
							<div className="flex flex-wrap gap-2 justify-center">
								{technologies.map(tech => (
									<span
										key={tech}
										className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				<button
					onClick={onStart}
					className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-12 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-xl hover:scale-105 transform"
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
};

export default ProjectStartScreen;