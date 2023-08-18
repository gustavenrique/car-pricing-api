import { Config } from 'jest';

const config: Config = {
    rootDir: '../../',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    collectCoverageFrom: ['**/*.(t|j)s'],
    testRegex: '.e2e-spec.ts$',
    moduleNameMapper: {
        '^(.*)src/(.*)': '<rootDir>/src/$2',
    },
    workerThreads: true,
    setupFilesAfterEnv: ['<rootDir>/test/e2e/setup.ts'],
};

export default config;
