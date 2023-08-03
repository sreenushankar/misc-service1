import type { Config } from 'jest';

const config: Config = {
    testMatch: ["**/tests/**/*.test.(ts|js)",],
    transform: {
        "\\.[jt]sx?$": ["ts-jest", {
            "useESM": true
        }]
    },
    moduleNameMapper: {
        'ipaddr.js': '<rootDir>/node_modules/ipaddr.js',
        "(.+)\\.[jt]s": "$1",
    },
    extensionsToTreatAsEsm: [".ts"],
    setupFiles: [
        'dotenv/config'
    ],

    setupFilesAfterEnv: ['./tests/setupTests.ts'],
    moduleDirectories: ['node_modules']
};

export default config;