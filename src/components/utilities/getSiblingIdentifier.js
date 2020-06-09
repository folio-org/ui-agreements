export default function (eresource = {}, type) {
  const relatedTitles = eresource?.relatedTitles || [];
  // find all siblings of subsType 'print'
  const printSiblings = relatedTitles?.filter(r => r.subType.value === 'print');

  if (!printSiblings) return undefined;

  let value;

  printSiblings.forEach(printSibling => {
    // find first identifiers value of namespace 'type'
    if (value === undefined) {
      value = printSibling.identifiers.find(i => i.identifier.ns.value === type)?.identifier?.value;
    }
  });
  return value;
}
