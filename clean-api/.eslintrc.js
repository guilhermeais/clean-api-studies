const path = require('path')

const tsConfigFile = path.resolve(__dirname, 'tsconfig.json')
module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: tsConfigFile
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off'
  },
  root: true
}
