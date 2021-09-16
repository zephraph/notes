function rfdName(tp) {
  return parseInt(tp.file.title.split("--")[0].trim() || 0) || ""
}

module.exports = rfdName