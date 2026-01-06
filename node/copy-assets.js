const fs = require("fs")
const path = require("path")

const repoRootDir = path.join(__dirname, "..")
const nodePackageDir = __dirname
const nodeSrcDir = path.join(nodePackageDir, "src")

const copyFileIfExists = (sourceFilePath, destinationFilePath) => {
  if (!fs.existsSync(sourceFilePath)) {
    return
  }
  fs.mkdirSync(path.dirname(destinationFilePath), { recursive: true })
  fs.copyFileSync(sourceFilePath, destinationFilePath)
}

// Keep the monorepo source of truth in ../src, but ensure the Node package is self-contained
// for `npm pack`/`npm publish` and for local development builds.
copyFileIfExists(
  path.join(repoRootDir, "src", "vocabulary.txt"),
  path.join(nodePackageDir, "vocabulary.txt")
)
copyFileIfExists(
  path.join(repoRootDir, "src", "jonesum.c"),
  path.join(nodeSrcDir, "jonesum.c")
)
copyFileIfExists(
  path.join(repoRootDir, "src", "jonesum.h"),
  path.join(nodeSrcDir, "jonesum.h")
)

// npm displays the README from the published tarball; copying the repo README keeps docs consistent.
copyFileIfExists(
  path.join(repoRootDir, "README.md"),
  path.join(nodePackageDir, "README.md")
)
