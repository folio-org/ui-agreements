import { agreementRelationshipTypes } from '../../constants';

const isOutwardRelationship = type => !!(agreementRelationshipTypes.find(t => t.outward.value === type));

const isInwardRelationship = type => !!(agreementRelationshipTypes.find(t => t.inward.value === type));

const getCorrespondingInwardValue = outwardValue => {
  const relationship = agreementRelationshipTypes.find(t => t.outward.value === outwardValue);
  return relationship.inward.value;
};

const getCorrespondingOutwardValue = inwardValue => {
  const relationship = agreementRelationshipTypes.find(t => t.inward.value === inwardValue);
  return relationship.outward.value;
};

export function splitRelatedAgreements(agreement) {
  const { relatedAgreements = [] } = agreement;

  const outward = relatedAgreements
    .filter(r => isOutwardRelationship(r.type))
    .map(({ agreement:a, ...rest }) => ({
      ...rest,
      inward: a ? a.id : undefined,
    }));

  const inward = relatedAgreements
    .filter(r => isInwardRelationship(r.type))
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
