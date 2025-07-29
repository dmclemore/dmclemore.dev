import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Desmond McLemore - Full-Stack Software Engineer",
	description:
		"Portfolio of Desmond McLemore, Full-Stack Software Engineer with 4 years of experience specializing in React, Node.js, and scalable web applications.",
	keywords: [
		"Software Engineer",
		"Full-Stack Developer",
		"React",
		"Node.js",
		"TypeScript",
		"Portfolio",
	],
	authors: [{ name: "Desmond McLemore" }],
	openGraph: {
		title: "Desmond McLemore - Full-Stack Software Engineer",
		description:
			"Portfolio showcasing 4 years of experience in building scalable web applications",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} font-sans antialiased`}>
				<ThemeProvider
					attribute="data-theme"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navigation />
					<main className="pt-16">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
