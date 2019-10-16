const INWARD = '$$inward$$';

export function splitRelatedAgreements(agreement, data) {
  const { relationships = [] } = agreement;

  const outward = relationships
    .filter(r => !r.type.endsWith(INWARD))
    .map(({ agreement:a, ...rest }) => ({
      ...rest,
      inward: a ? a.id : undefined,
    }));

  const inward = relationships
    .filter(r => r.type.endsWith(INWARD))
    .map(({ agreement:a, ...rest }) => ({
      ...rest,
      outward: a ? a.id : undefined,
    }));

  if (outward) agreement.outwardRelationships = outward;
  if (inward) agreement.inwardRelationships = inward;

  return agreement;
}

export function joinRelatedAgreements(agreement, data) {
  const { inwardRelationships = [], outwardRelationships = [] } = agreement;

  const relationships = [
    ...inwardRelationships
      .map(({ inward:_, outward, type, ...rest }) => ({
        ...rest,
        agreement: outward,
        type: `${type.value}${INWARD}`,
      })),
    ...outwardRelationships
      .map(({ inward, outward:_, type, ...rest }) => ({
        ...rest,
        agreement: inward,
        type: type.value,
      })),
  ];

  agreement.relationships = relationships;

  return agreement;
}
