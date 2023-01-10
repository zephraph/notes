module.exports = async function rfd_name(td) {
  return parseInt(td.file.title.split('--')[0].trim() || '0') || ''
}
