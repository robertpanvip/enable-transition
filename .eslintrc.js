module.exports = {
    'root': true,
    'env': {
        'browser': true,
        'node': true,
        'es6': true,
        'jest': true,
        'jsx-control-statements/jsx-control-statements': true // 能够在jsx中使用if，需要配合另外的babel插件使用
    },
    parser:  '@typescript-eslint/parser', //定义ESLint的解析器
    'parserOptions': {
        'sourceType': 'module',
        tsconfigRootDir: __dirname,
        'ecmaFeatures': {
            'jsx': true,
            'tsx': true,
            'experimentalObjectRestSpread': true
        }
    },
    'globals': {
        // "wx": "readonly",
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],//定义文件继承的子规范
    'settings': {
        'react': {
            'version': 'detect' // 自动读取已安装的react版本
        }
    },
    'plugins': ['@typescript-eslint', 'react', 'jsx-control-statements'],
    'rules': {
        'no-trailing-spaces': 0,
        'complexity': ['warn', { max: 10 }], //圈复杂度检查
        'indent': ['error', 4],
        'func-names': 0,//该规则可以强制或禁止使用命名函数表达式
        'arrow-parens': 0,//无论参数如何，该规则都会在箭头函数参数周围加上括号
        'prefer-const': 1,            // 强制 const
        'prefer-destructuring': [1, { //使用 JavaScript ES6，添加了一种新的语法，用于从数组索引或对象属性创建变量，称为解构。此规则强制使用解构而不是通过成员表达式访问属性
            'array': false,
            'object': true
        }],
        'arrow-body-style': 0,// 打开该规则可以强制或禁止在箭头函数体的周围使用大括号
        'arrow-spacing': [2, { //规则在箭头函数的箭头（=>）之前/之后标准化间距样式
            'before': true,
            'after': true
        }],
        'camelcase': [1, {   //是否使用驼峰
            'properties': 'always'
        }],
        'require-jsdoc': ['error', {
            'require': {
                'FunctionDeclaration': true,
                'MethodDefinition': true,
                'ClassDeclaration': false,
                'ArrowFunctionExpression': false,
                'FunctionExpression': false
            }
        }],//必须写注释
        'no-misleading-character-class': 0,//不允许字符类语法中使用多个代码点组成的字符
        'no-control-regex': 0,//控制字符是 ASCII 范围0-31中特殊的不可见字符。这些字符很少用在 JavaScript 字符串中，因此包含这些字符的正则表达式很可能是一个错误。
        'max-len': 0, // 单行长度限制
        'max-classes-per-file': 0,//限制每个文件的类的数量'
        'eqeqeq': ['warn', 'always', { 'null': 'ignore' }],//是否使用===
        'array-callback-return': 0,//Array有几种过滤，映射和折叠的方法。如果我们忘记return在这些回调中写入语句，那可能是一个错误
        'jsx-quotes': 0,//此规则强制在 JSX 属性中一致使用双引号或单引号
        'linebreak-style': 0,//此规则强制执行统一的行结尾，而不受操作系统，VCS 或整个代码库中使用的编辑器的影响
        'comma-dangle': ['error', 'only-multiline'],           // 不强制  对象最后一个 ,
        'class-methods-use-this': 0,  // 不判断对象方法里是否使用了 this
        'consistent-return': 0,       // 允许函数根据代码分支具有不同的return行为
        'consistent-this': ['error', '_this'],       // this 的别名统一使用 _this
        'curly': [2, 'all'],          // 语句块不允许省略花括号
        'func-style': 0, // 只允许使用 function 定义函数
        'spaced-comment': 0, //注释开始后，此规则将强制间距的一致性
        'multiline-comment-style': 0, // 多行注释
        'no-await-in-loop': 0,        // 循环里的 await
        'no-bitwise': 0,              // 允许位运算
        'no-console': 1,              // 上线的代码里不允许有 console
        'no-else-return': 0,
        'no-empty-function': ['error', { allow: ['arrowFunctions'] }], // 不允许空函数
        'no-nested-ternary': 1,       // 不允许三元运算嵌套
        /* 'no-param-reassign': ['error', { props: false }],              // 禁止对参数赋值*/
        'no-param-reassign': 0,//运行对参数赋值
        'no-plusplus': 0,             // 允许 ++  -- 运算
        'no-script-url': 0,           //使用javascript:有些人认为使用URL是一种形式eval。在javascript:URL中传递的代码必须以与eval处理相同的方式由浏览器进行分析和评估
        'no-throw-literal': 0,//该规则旨在通过不允许抛出不可能是Error对象的文字和其他表达式来抛出异常时保持一致性
        'no-unused-vars': ['warn', {
            'vars': 'all',
            'args': 'after-used',
            'ignoreRestSiblings': false
        }],
        'no-unused-expressions': ['error', {
            'allowShortCircuit': true,
            'allowTernary': true
        }],//该规则旨在消除对程序状态没有影响的未使用的表达式
        'no-warning-comments': ['warn', {
            terms: ['todo', 'fixme', 'fixed'],
            location: 'anywhere'
        }], //此规则报告包含其配置中指定的任何预定义术语的注释。
        'no-multiple-empty-lines': 0, // 允许连续空行
        'no-mixed-operators': 0,//用括号括起复杂的表达式可以明确开发人员的意图，从而使代码更具可读性。此规则会在表达式中连续使用不含运算符的不同运算符时发出警告
        'no-prototype-builtins': 0, // 禁止操作 Object.prototype
        'object-curly-newline': ['error', { consistent: true }],//此规则在对象文字或解构赋值的大括号内强制执行一致的换行符
        'prefer-arrow-callback': ['warn', {
            allowNamedFunctions: false,
            allowUnboundThis: true
        }], //此规则定位用作回调函数或函数参数的函数表达式。任何可以被箭头函数取代而不改变结果的错误都会产生。
        'import/no-amd': 0,         // 允许 amd 导入风格
        'import/no-dynamic-require': 0, // 允许使用 require 动态导入
        'import/no-commonjs': 0,    // 允许 commonjs 风格
        'import/no-extraneous-dependencies': 0,// 允许导入除了package外的依赖
        'react/destructuring-assignment': 0, //关闭强制需要使用变量解构方式对变量进行赋值
        'react/state-in-constructor': 0,//关闭强制让state 写在constructor
        'react/prop-types': 0, //关闭类型检测
        'react/no-danger': 0, // 允许使用 dangerouslySetInnerHTML
        'react/no-direct-mutation-state': 2, // 禁止直接修改 state
        'react/no-did-update-set-state': 0,     //
        'react/jsx-props-no-spreading': 0,//允许jsx中props中 使用... 如<Comp {...props}/>
        'react/no-find-dom-node': 0,            // 打开禁止使用 findDomNode
        'react/no-render-return-value': 2,      // render 必须有返回值
        'react/no-set-state': 0,                // 关闭 尽量用无状态组件
        'react/prefer-es6-class': ['error', 'always'], //除非有更好的理由使用混淆(mixins)，否则就使用组件类继承 React.Component
        'react/require-optimization': 0,//是否强制优化react组件
        'react/jsx-child-element-spacing': 0,//由于React在可能的情况下会删除元素之间多余的新行，因此最终可能会出现内联元素，而这些内联元素与相邻文本之间不会留有空格。这通常表明存在错误，因此该规则尝试检测
        'react/jsx-equals-spacing': [2, 'never'],//通过在之前和之后要求或不允许一个或多个空格，此规则将强制JSX属性中等号周围的间距保持一致=。
        'react/prefer-stateless-function': 2,//强制将无状态React组件编写为纯函数
        'react/jsx-first-prop-new-line': [2, 'multiline-multiprop'], // 多行属性才换行
        'react/jsx-handler-names': ['warn', {
            'eventHandlerPrefix': 'on',
            'eventHandlerPropPrefix': 'handle',
            'checkLocalVariables': false
        }],//确保用于处理事件的任何组件或属性方法都正确加上前缀
        'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx','.tsx'] }], //jsx文件命名
        'react/jsx-indent': [2, 4], // jsx缩进2个空格
        'react/jsx-indent-props': [2, 4],//验证JSX中的props缩进 该规则旨在实施一致的缩进样式。默认样式为4 spaces
        'react/jsx-key': 2,         // 循环元素必须有key
        'react/jsx-no-target-blank': 0,//该规则旨在通过要求rel='noreferrer noopener'外部链接以及可选的任何动态生成的链接来防止用户生成的链接创建安全漏洞 。
        'react/jsx-one-expression-per-line': 0, // 关闭 表达式占单行
        'react/jsx-sort-default-props': 0,//强制defaultProps声明按字母顺序排序
        'react/jsx-sort-props': 0,//强制props按字母顺序排序
        'react/jsx-tag-spacing': 0,//验证JSX左括号和右括号中和周围的空格
        'react/no-array-index-key': 0, //不能使用数组的index作为key在map中
        'react/static-property-placement': 0, //是否允许propTypes 写在类中
        'jsx-a11y/no-static-element-interactions': 0,//给div标签赋予语义化
        'jsx-a11y/click-events-have-key-events': 0,//对于手残用户使用键盘操作
        'jsx-a11y/no-noninteractive-element-interactions': 0, //非互动元素互动
        'jsx-a11y/anchor-is-valid': 0, //禁止使用a href='javascript:;'
        'no-useless-catch': 0,
        'no-lone-blocks': 0,
        'no-return-await': 0,
        'no-underscore-dangle': 0,
        '@typescript-eslint/no-var-requires':0,
        '@typescript-eslint/ban-types':0
    }
};
