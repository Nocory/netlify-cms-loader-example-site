module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		//"plugin:vue/recommended"
	],
	"parserOptions": {
		"sourceType": "module"
	},
	"rules": {
		"no-unused-vars": [
			"warn"
		],
		"indent": [
			"warn",
			"tab"
		],
		"linebreak-style": [
			"off",
			"unix"
		],
		"quotes": [
			"off",
			"double"
		],
		"semi": [
			"warn",
			"never"
		],
		"no-console": [
			"off"
		],
		"no-unexpected-multiline": 1,
		"no-await-in-loop": 1,
		"no-extra-parens": 1
	}
}