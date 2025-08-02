import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
	allConfig: js.configs.all,
	recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
	...compat.config({
		extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
		settings: {
			next: {
				rootDir: 'src/',
			},
		},
	}),
];

export default eslintConfig;
