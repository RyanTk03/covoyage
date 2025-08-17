import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				// Couleurs principales
				"primary-color": "#e3f2fd",       // blanc cassé, doux pour le fond
				"secondary-color": "#3b82f6",     // indigo social, pour les accents

				// Couleurs secondaires
				"accent-color": "#3b82f6",        // bleu vif pour les actions clés (commentaire, like)
				"highlight-color": "#22d3ee",     // cyan doux pour hover, badges

				// États et feedbacks
				"gray-color": "#9ca3af",          // gris neutre (texte secondaire)
				"border-color": "#e5e7eb",        // gris clair (bordures, séparateurs)
				"green-color": "#10b981",         // validation / succès
				"red-color": "#ef4444",           // erreur
				"yellow-color": "#facc15",        // alerte douce

				// Thème foncé (optionnel si tu veux étendre plus tard)
				"dark-bg": "#0f172a",
				"dark-surface": "#1e293b",
				"dark-text": "#f1f5f9"
			},
		},
	},
	plugins: [],
});
export default config;
