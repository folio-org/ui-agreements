const INWARD = '$$inward$$';

export function splitRelatedAgreements(agreement) {
  const { relatedAgreements = [] } = agreement;

  const outward = relatedAgreements
    .filter(r => !r.type.endsWith(INWARD))
    .map(({ agreement:a, ...rest }) => ({
      ...rest,
      inward: a ? a.id : undefined,
    }));

  const inward = relatedAgreements
    .filter(r => r.type.endsWith(INWARD))
    .map(({ agreement:a, type, ...rest }) => ({
      ...rest,
      outward: a ? a.id : undefined,
      type: type.substring(0, type.indexOf(INWARD)),
    }));

  if (outward) agreement.outwardRelationships = outward;
  if (inward) agreement.inwardRelationships = inward;

  return agreement;
}

export function joinRelatedAgreements(agreement) {
  const { inwardRelationships = [], outwardRelationships = [] } = agreement;

  const relatedAgreements = [
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

  agreement.relatedAgreements = relatedAgreements;

  return agreement;
}
