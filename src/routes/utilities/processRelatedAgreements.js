import { agreementRelationshipTypes } from '../../constants';

const isOutwardRelationship = type => !!(agreementRelationshipTypes.find(t => t.outward.value === type));

const isInwardRelationship = type => !!(agreementRelationshipTypes.find(t => t.inward.value === type));

const getCorrespondingInwardValue = outwardValue => {
  const relationship = agreementRelationshipTypes.find(t => t.outward.value === outwardValue);
  return relationship ? relationship.inward.value : undefined;
};

const getCorrespondingOutwardValue = inwardValue => {
  const relationship = agreementRelationshipTypes.find(t => t.inward.value === inwardValue);
  return relationship ? relationship.outward.value : undefined;
};

export function splitRelatedAgreements(agreement) {
  const {
    inwardRelationships = [],
    relatedAgreements = [],
    outwardRelationships = [],
  } = agreement;

  const outward = relatedAgreements
    .filter(r => {
      if (r.type) return isOutwardRelationship(r.type);

      // Else, there's no `type` so we're deleting this relationship.
      // We need to figure out whether it was originally in `outward` or `inwardRelationships`.
      return !!(outwardRelationships.find(or => or.id === r.id));
    })
    .map(({ agreement:a, ...rest }) => ({
      ...rest,
      inward: a ? a.id : undefined,
    }));

  const inward = relatedAgreements
    .filter(r => {
      if (r.type) return isInwardRelationship(r.type);

      // Else, there's no `type` so we're deleting this relationship.
      // We need to figure out whether it was originally in `outward` or `inwardRelationships`.
      return !!(inwardRelationships.find(or => or.id === r.id));
    })
    .map(({ agreement:a, type, ...rest }) => ({
      ...rest,
      outward: a ? a.id : undefined,
      type: getCorrespondingOutwardValue(type),
    }));

  if (outward) agreement.outwardRelationships = outward;
  if (inward) agreement.inwardRelationships = inward;
}

export function joinRelatedAgreements(agreement) {
  const { inwardRelationships = [], outwardRelationships = [] } = agreement;

  const relatedAgreements = [
    ...inwardRelationships
      .map(({ inward:_, outward, type, ...rest }) => ({
        ...rest,
        agreement: outward,
        type: getCorrespondingInwardValue(type.value),
      })),
    ...outwardRelationships
      .map(({ inward, outward:_, type, ...rest }) => ({
        ...rest,
        agreement: inward,
        type: type.value,
      })),
  ];

  agreement.relatedAgreements = relatedAgreements;
}
