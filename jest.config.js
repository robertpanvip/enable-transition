//jest 配置参考https://www.jianshu.com/p/1bef70cfe712
module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.(js?|jsx?|tsx?)$': 'babel-jest',
    },
    testMatch: [ // 匹配的测试文件
        /* '<rootDir>/src/package/message/__test__/!**!/!*.{js,jsx,tsx,mjs}',*/
        '<rootDir>/src/**/__test__/**/*.{js,jsx,tsx,mjs}',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: [
        '<rootDir>/jest.setup.js',
        '<rootDir>/jest.shim.js'
    ],
    moduleNameMapper: {
        '^.+iconfont.ts': '<rootDir>/jest.assets.js',
        '\\.(css|scss)': 'identity-obj-proxy', //如果你的jsx文件里面有import style文件，那么跑react的component文件会报错。为了修复这个问题，我们需要为我们的'className' mock一个proxy。可以按照一个名叫'identity-obj-proxy'的库来做这个事情：
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest.assets.js', //mock 在react组件里import的图片

    },
    snapshotSerializers: ['enzyme-to-json/serializer']
}
