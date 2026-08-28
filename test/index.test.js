const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const cmdDir = path.join(__dirname, '..', 'cmd')
const commandFiles = fs.readdirSync(cmdDir).filter(file => !file.startsWith('.'))

test('cmd directory contains command modules', () => {
  assert.ok(commandFiles.length > 0)
})

for (const file of commandFiles) {
  test(`cmd/${file} exports a well-formed yargs command`, () => {
    const command = require(path.join(cmdDir, file))

    assert.strictEqual(typeof command.desc, 'string')
    assert.ok(Array.isArray(command.command) && command.command.length > 0)
    assert.strictEqual(typeof command.builder, 'function')
    assert.strictEqual(typeof command.handler, 'function')
  })
}
