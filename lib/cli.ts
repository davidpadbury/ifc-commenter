import comment from './comment'
import fs = require('fs')
import yargs = require('yargs')

const argv = yargs.argv

const usage = () => {
  const message = [
    'Usage: ifc-commenter [options] filename',
    '   --indent indent to use between nested generated comments',
    '   --output write the output to a file rather than stdout'
  ].join('\n')

  console.error(message)
}

if (argv._.length !== 1) {
  usage()
  process.exit(1)
}

const filename = argv._[0]

const readFile = () => {
  try {
    return fs.readFileSync(filename, 'utf8')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const content = readFile()
const indent = argv.indent || comment.defaultIndent
const result = comment(content, indent)

if (argv.output) {
  try { fs.writeFileSync(argv.output, result) } catch (err) {
    console.error(err)
    process.exit(1)
  }
} else {
  process.stdout.write(result)
}
