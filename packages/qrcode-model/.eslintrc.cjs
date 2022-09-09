module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    eqeqeq: ['error', 'smart'],
    curly: 'error',
    'multiline-comment-style': ['error', 'starred-block'],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'signature',
          'static-initialization',

          'static-get',
          'public-static-get',
          'static-set',
          'public-static-set',
          'static-field',
          'public-static-field',

          'protected-static-get',
          'protected-static-set',
          'protected-static-field',

          'private-static-get',
          'private-static-set',
          'private-static-field',

          'static-method',
          'public-static-method',

          'field',
          'public-field',
          'get',
          'public-get',
          'set',
          'public-set',

          'decorated-get',
          'public-decorated-get',
          'decorated-set',
          'public-decorated-set',
          'decorated-field',
          'public-decorated-field',

          'abstract-get',
          'public-abstract-get',
          'abstract-set',
          'public-abstract-set',
          'abstract-field',
          'public-abstract-field',

          'instance-get',
          'public-instance-get',
          'instance-set',
          'public-instance-set',
          'instance-field',
          'public-instance-field',

          'protected-get',
          'protected-instance-get',
          'protected-set',
          'protected-instance-set',
          'protected-field',
          'protected-instance-field',

          'protected-decorated-get',
          'protected-decorated-set',
          'protected-decorated-field',

          'protected-abstract-get',
          'protected-abstract-set',
          'protected-abstract-field',

          'private-get',
          'private-instance-get',
          'private-set',
          'private-instance-set',
          'private-field',
          'private-instance-field',

          'private-decorated-get',
          'private-decorated-set',
          'private-decorated-field',

          'private-abstract-get',
          'private-abstract-set',
          'private-abstract-field',

          'constructor',
          'public-constructor',
          'protected-constructor',
          'private-constructor',

          'method',
          'public-method',

          'decorated-method',
          'public-decorated-method',

          'abstract-method',
          'public-abstract-method',

          'instance-method',
          'public-instance-method',

          'protected-static-method',
          'protected-method',
          'protected-instance-method',
          'protected-decorated-method',
          'protected-abstract-method',

          'private-static-method',
          'private-method',
          'private-instance-method',
          'private-decorated-method',
          'private-abstract-method',
        ],
      },
    ],
  },
};
