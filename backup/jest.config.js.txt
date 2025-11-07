module.exports = {
    moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(react-router-dom|@some-esm-lib)/)', // 여기에 예외 모듈 추가
    ],
};