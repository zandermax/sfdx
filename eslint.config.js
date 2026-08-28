const js = require('@eslint/js')
const globals = require('globals')
const eslintConfigPrettier = require('eslint-config-prettier')

module.exports = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      // Idiomatic throughout cmd/: `results[numResults++] = x` - the final increment's value
      // is never re-read, which is fine, not a bug.
      'no-useless-assignment': 'off'
    }
  },
  {
    ignores: ['node_modules/', 'docs/sfdx-help*.txt', 'docs/sfdx-help-extended.json', 'CHANGELOG.md']
  }
]
