import orderBy from 'lodash/orderBy';
// Taken from OA

// SHOULD ONLY BE USED WITH SMALL DATA SETS
// Takes in data, formatter and the current state of sorting ({column: 'attribute' direction:'asc'})
// Formatter defines depth of object value to sort by i.e. 'input.attribute.value'
const getSortedItems = (input, sortFormatter, sortState) => {
  // Takes in respectively, data, what to sort the data by (string) and the direction in which to sort (asc, desc)
  return orderBy(input, sortFormatter?.[sortState?.column] ?? sortState?.column, sortState?.direction);
};

export default getSortedItems;
