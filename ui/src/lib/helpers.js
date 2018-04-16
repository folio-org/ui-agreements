let tableFormatters = {
  date :cell => (cell.value ? new Date(cell.value).toLocaleDateString() : '')
}

export {tableFormatters}