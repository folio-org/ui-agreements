import refdata from './refdata';

export const relatedAgreements = [
  {
    id: '6bcca40d-138c-4c51-b7f5-235fb02552a6',
    note: 'test note 1',
    agreement: {
      id: 'f591806e-fe8c-4b16-a3cb-8cccc180d82b',
      name: 'Related agreement 1',
      agreementStatus: refdata.find(rdc => rdc.desc === 'SubscriptionAgreement.AgreementStatus').values.find(rdv => rdv.value === 'active'),
      startDate: '2021-09-02',
      endDate: null
    },
    type: refdata.find(rdc => rdc.desc === 'AgreementRelationship.Type').values.find(rdv => rdv.value === 'supersedes').value
  },
  {
    id: 'ac2fde6e-a6a2-4df5-b244-8d803382d2d5',
    note: 'test note 2',
    agreement: {
      id: 'b958c1be-54f5-4f3d-9131-4255cd21b109',
      name: 'Related agreement 2',
      agreementStatus: refdata.find(rdc => rdc.desc === 'SubscriptionAgreement.AgreementStatus').values.find(rdv => rdv.value === 'in_negotiation'),
      startDate: '2021-09-18',
      endDate: null
    },
    type: refdata.find(rdc => rdc.desc === 'AgreementRelationship.Type').values.find(rdv => rdv.value === 'provides_post-cancellation_access_for').value
  }
];
