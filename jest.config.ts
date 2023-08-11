import { Config } from 'jest';

const config: Config = {
    rootDir: '.',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    collectCoverageFrom: ['**/*.(t|j)s'],
    moduleNameMapper: {
        '^(.*)src/(.*)': '<rootDir>/src/$2',
    },
    workerThreads: true,
};

export default config;
