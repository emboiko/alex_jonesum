const fs = require("fs")
const path = require("path")
let binding
try {
  binding = require("../build/Release/jonesum.node")
} catch (e) {
  try {
    binding = require("../build/Debug/jonesum.node")
  } catch (e2) {
    throw new Error("Native module not found. Run 'npm install' to build it.")
  }
}

const loadVocabulary = () => {
  const packageFile = path.join(__dirname, "..", "vocabulary.txt")
  const srcFile = path.join(__dirname, "..", "..", "src", "vocabulary.txt")

  let vocabularyFile = null
  if (fs.existsSync(packageFile)) {
    vocabularyFile = packageFile
  } else if (fs.existsSync(srcFile)) {
    vocabularyFile = srcFile
  }

  if (!vocabularyFile) {
    throw new Error(
      `Could not find vocabulary.txt file. Looked in: ${packageFile} and ${srcFile}`
    )
  }

  const content = fs.readFileSync(vocabularyFile, "utf-8")
  const lines = content.split(/\r?\n/)

  const vocabulary = []
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine.length > 0) {
      vocabulary.push(trimmedLine)
    }
  }

  return vocabulary
}

class AlexJones {
  constructor() {
    const vocabulary = loadVocabulary()
    this._jonesum = new binding.Jonesum(vocabulary)
  }

  rant(sentenceCount = null) {
    if (sentenceCount === null || sentenceCount === undefined) {
      return this._jonesum.rant()
    }
    return this._jonesum.rant(sentenceCount)
  }
}

module.exports = AlexJones
