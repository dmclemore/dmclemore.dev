"use client";

import { motion } from "framer-motion";
import { Award, MapPin, Building } from "lucide-react";

export function AboutSection() {
	return (
		<section id="about" className="py-20 bg-muted/30">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
						About Me
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Passionate about building scalable web applications and solving
						complex technical challenges
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<div className="space-y-6">
							<p className="text-muted-foreground leading-relaxed">
								I'm a Full-Stack Software Engineer with 4 years of experience
								specializing in React and Node.js ecosystems. Currently, I work
								at Xometry where I architect and build production systems that
								serve thousands of users daily.
							</p>

							<p className="text-muted-foreground leading-relaxed">
								My expertise spans from creating intuitive user interfaces to
								designing robust backend architectures. I'm particularly
								passionate about performance optimization, spam detection
								systems, and building scalable verification workflows that
								enhance user experience.
							</p>

							<p className="text-muted-foreground leading-relaxed">
								When I'm not coding, you can find me snowboarding, hiking, or
								camping in the beautiful Pacific Northwest outdoors. I also
								enjoy unwinding with video games, watching anime, and exploring
								Seattle's diverse food scene.
							</p>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						<div className="bg-background rounded-lg p-6 border border-border">
							<div className="flex items-center space-x-3 mb-4">
								<Building className="h-5 w-5 text-primary" />
								<span className="font-medium text-foreground">
									Current Role
								</span>
							</div>
							<p className="text-muted-foreground">
								Senior Software Engineer at Xometry
							</p>
						</div>

						<div className="bg-background rounded-lg p-6 border border-border">
							<div className="flex items-center space-x-3 mb-4">
								<Award className="h-5 w-5 text-accent" />
								<span className="font-medium text-foreground">Recognition</span>
							</div>
							<p className="text-muted-foreground">
								Founders Award Recipient Q2 2023
							</p>
						</div>

						<div className="bg-background rounded-lg p-6 border border-border">
							<div className="flex items-center space-x-3 mb-4">
								<MapPin className="h-5 w-5 text-secondary-foreground" />
								<span className="font-medium text-foreground">Location</span>
							</div>
							<p className="text-muted-foreground">Seattle, Washington</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
