module.exports = results => {
  let result = {}
  for (r of results) {
    if (r.stdout) result.stdout = result.stdout ? result.stdout + ' ' + r.stdout : r.stdout
    if (r.stderr) result.stderr = result.stderr ? result.stderr + ' ' + r.stderr : r.stderr
  }

  return result
}
