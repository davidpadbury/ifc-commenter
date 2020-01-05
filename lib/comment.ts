import detectNewLine = require('detect-newline')

// pattern for extracting instruction ids
const referencePattern = /#(\d+)/g

const defaultIndent = '  '
comment.defaultIndent = defaultIndent

/**
 * Append the IFS content supplied in `input` with comments of the instructions being referenced.
 * As there can be forward references we go over the input twice.
 * On the first we collect the id of the line (if specified), and all other instructions it references.
 * On the second we print each line and if it references any instructions, print their respective lines as comments.
 * If these comments reference other instructions we print as well with an additional indent.
 */
export default function comment (input: string, indent: string = defaultIndent): string {
  // in an attempt to support files created on windows try to guess at what the newline character of the content is
  // if none is found a unix newline will be assumed
  const newLine = detectNewLine.graceful(input)
  // split into individual lines (for the time being we assume instructions are not split between lines)
  const lines = input.split(newLine)
  // sparse array indexed by line number containing the instruction id that line contains
  const lineIds: Array<number> = []
  // sparse array indexed by id containing the line number of that instruction
  const idLines: Array<number> = []
  // map from instruction id to an array of instruction ids that the instruction referenced
  const references: Map<number, Array<number>> = new Map<number, Array<number>>()

  let output: string = ''

  // add a line to the output
  // prepend a new line if there has been prior output
  const appendLine = (() => {
    let first = true
    return (line: string) => {
      if (!first) output += newLine + line
      else {
        output = line
        first = false
      }
    }
  })()

  // first parse to index identifiers and references
  lines.forEach((text, index) => {
    // extract all ids from the line in the form #123
    const result = parseLine(text)

    if (!result) return

    lineIds[index] = result.id
    idLines[result.id] = index
    references.set(result.id, result.references)
  })

  // second parse to build the output
  lines.forEach((line, index) => {
    // always just output the line as is
    appendLine(line)

    // if it's got a id, print the lines it references
    const id = lineIds[index]
    if (id) {
      printReferences(id)
    }
  })

  /**
     * Print comments for the instructions this instruction references.
     * Depth indicates how much to indent the comments as we also print references
     * of references in a hierarchy.
     */
  function printReferences (id: number, depth = 0) {
    // for each reference of this instruction
    (references.get(id) || []).forEach(ref => {
      // lookup the line text of the instruction
      const refLine = lines[idLines[ref]]

      if (!refLine) return

      // generate the indent
      let comment = ''
      for (let i = 0; i <= depth; i++) {
        comment += indent
      }
      // generate the comment
      comment = comment + `/*${refLine}*/`

      appendLine(comment)

      // do this recursively to build a hierarchy
      printReferences(ref, depth + 1)
    })
  }

  return output
}

/**
 * Parse all instruction ids from line.
 */
function parseLine (line: string) {
  let id = null
  const references = []

  let match = null
  while ((match = referencePattern.exec(line))) {
    if (id === null) {
      // if we're looking for an id for the line but don't find it on the first character
      // ignore parsing the entire line
      if (match.index !== 0) continue
      id = parseInt(match[1], 10)
    } else {
      references.push(parseInt(match[1], 10))
    }
  }

  return id !== null ? { id, references } : null
}
