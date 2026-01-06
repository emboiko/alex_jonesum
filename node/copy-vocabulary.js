const fs = require("fs")
const path = require("path")

const src = path.join(__dirname, "..", "src", "vocabulary.txt")
const dst = path.join(__dirname, "vocabulary.txt")

// Used by preinstall script:
if (fs.existsSync(src)) {
  fs.copyFileSync(src, dst)
  console.log("Copied vocabulary.txt to node/ directory")
}
