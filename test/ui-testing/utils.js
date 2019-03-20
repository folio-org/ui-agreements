// Utilities for tests in this repo.

module.exports.formattedDate = function formattedDate(datestring) {
  const date = new Date(datestring);

  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}}`;
};
