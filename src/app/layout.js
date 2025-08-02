import './globals.css';

export const metadata = {
	title: 'Game',
	description: '',
};

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body className="antialiased">{children}</body>
		</html>
	);
}
