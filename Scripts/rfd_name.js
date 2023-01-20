module.exports = function rfd_name(td) {
  console.log('called?')
  return parseInt(td.file.title.split('--')[0].trim() || '0') || ''
}
