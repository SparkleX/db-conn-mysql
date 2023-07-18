/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
	testTimeout: 18000,
	roots: [
		"src"
	],
	collectCoverage:true,
	collectCoverageFrom: ["**/*.ts"],
	coverageDirectory: "coverage",
	coverageReporters: ["lcov"],
	coverageThreshold: {
		global: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100
		}
	},
	clearMocks: true
};