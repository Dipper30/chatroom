module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:import/errors',
        "plugin:import/typescript",
        'plugin:jsx-a11y/recommended',
        // 'plugin:prettier/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    "parser": "babel-eslint",
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2021,
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        'import',
        'jsx-a11y',
        'prettier',
        '@typescript-eslint'
    ],
    'rules': {
        // 'prettier/prettier': 2,
        'indent': ['warn', 2],
        'quotes': ['warn', 'single'],
        // 'no-unresolved': ['warn'],
        'comma-dangle': ['warn', 'never'],
        'semi': ['warn', 'always'],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'semi': ['warn', 'never'],
        'quotes': ['warn', 'single'],
        'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
        'new-cap': ['warn', { 'newIsCap': true, 'capIsNew': false }],
        'no-multiple-empty-lines': ['warn', { 'max': 1 }],
        'comma-style': ['warn', 'last'],
        'comma-spacing': ['warn', { 'before': false, 'after': true }],
        'comma-dangle': ['warn', 'always-multiline'],
        'no-implicit-coercion': 'warn',
        'no-invalid-this': 'warn',
        'no-multi-spaces': 'warn',
        'no-new-func': 'warn',
        'global-require': 'warn',
        'object-curly-spacing': ['warn', 'always'],
        'space-before-function-paren': ['warn', 'always'],
        'no-unused-vars': 'warn',
        "import/no-unresolved": [
            "warn",
            {
                "ignore": ['src/']
            }
        ],
        "react/self-closing-comp": 'off', // 防止没有children的组件的额外结束标签
        "react/sort-comp": 'warn', // 强制组件方法顺序
        "no-extra-boolean-cast": 'warn', // 禁止不必要的bool转换
        "react/no-array-index-key": 'error', // 防止在数组中遍历中使用数组key做索引
        "react/no-deprecated": 'error', // 不使用弃用的方法
        "react/jsx-equals-spacing": 'warn', // 在JSX属性中强制或禁止等号周围的空格
        "no-unreachable": 'warn', // 不能有无法执行的代码
        "no-mixed-spaces-and-tabs": 'warn', // 禁止混用tab和空格
        "prefer-arrow-callback": 'warn', // 比较喜欢箭头回调
        "arrow-parens": 'warn', // 箭头函数用小括号括起来
        "arrow-spacing": 'warn', // => 的前/后括号
        "react/prop-types": "off",
        "no-implicit-coercion": "off",
        'no-prototype-builtins': 'off',
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        'prefer-const': 'off',
        'arrow-parens': 'off',
        'jsx-a11y/no-autofocus': 'off',
        'no-invalid-this': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'click-events-have-key-events': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
    },
    "settings": {
        "import/ignore": [
            "node_modules"
        ]
    }
}
