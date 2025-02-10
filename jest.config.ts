import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    preset: 'ts-jest', //interprete para jest en ts
    testEnvironment: 'node',
    verbose: true, //nos permite decir como queres resolver la visibilidad de los test (da feedback en la terminal)
    coverageDirectory: 'coverage',
    collectCoverage: false, //nos permite decir habilitar el colector de covertura (va a buscar el resultado de los test y te da analisis de los test)
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    //collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts?(x)', '!**/node_modules/**', '!src/shared/db/orm.ts'],
    collectCoverageFrom: ['dist/**/*.js', '!dist/**/*.test.js?(x)', '!**/node_modules/**', '!dist/shared/db/orm.ts'],
    coverageThreshold: {
        global: {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1,


        }
    },
    coverageReporters: ['text-summary', 'lcov'],
    /*
    moduleNameMapper: {

    }
    */
}

export default config

