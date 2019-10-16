export default function processRelatedAgreements(agreement, data) {
  const { relationships } = agreement;

  if (!relationships || !relationships.length) return agreement;

  const outward = relationships
    .filter(r => !r.type.includes('-inward'))
    .map(({ agreement:a, ...rest }) => ({
      ...rest,
      inward: a.id,
    }));

  const inward = relationships
    .filter(a => a.type.includes('-inward'))
    .map(({ agreement:a, ...rest }) => ({
      ...rest,
      outward: a.id,
    }));

  agreement.inwardRelationships = inward;
  agreement.outwardRelationships = outward;

  return agreement;
}
