import { expect } from 'chai'
import comment from '../lib/comment'
import { fail } from 'assert'
import fs = require('fs')
import path = require('path')
import jsdiff = require('diff')
import chalk = require('chalk')

describe('comment', () => {
  describe('examples', () => {
    testExample('simple')

    function testExample (name: string) {
      it(`should produce expected output for ${name}.ifc`, () => {
        const input = readExample(`${name}.ifc`)
        const expected = readExample(`${name}.expected.ifc`)
        const output = comment(input)

        const diff = jsdiff.diffWords(expected, output)
        const differences = diff.filter(part => part.added || part.removed)

        if (differences.length > 0) {
          // print diff
          diff.forEach(part => {
            const color = part.added ? chalk.green : part.removed ? chalk.red : chalk.gray

            process.stderr.write(color(part.value))
          })

          fail('output produced was different to expected')
        }
      })
    }
  })

  it('should create a comment hierarchy', () => {
    const result = comment([
      '#1 first line',
      '#2 second line #1'
    ].join('\n'))

    expect(result).to.be.eql([
      '#1 first line',
      '#2 second line #1',
      '  /*#1 first line*/'
    ].join('\n'))
  })

  it('should not match a line that does not start with an id', () => {
    const input = [
      'this is not an instruction #1 #2',
      '#2 another'
    ].join('\n')
    const result = comment(input)
    expect(result).to.be.eql(input)
  })
})

function readExample (filename: string) {
  return fs.readFileSync(path.join(__dirname, 'examples', filename), 'utf8')
}
