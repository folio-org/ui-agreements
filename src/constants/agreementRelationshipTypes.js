export default [
  {
    type: 'supersedes',
    outward: {
      value: 'supersedes',
      label: 'Supersedes',
    },
    inward: {
      value: 'is-superseded-by',
      label: 'Is superseded by',
    },
  },
  {
    type: 'provides_post-cancellation_access_for',
    outward: {
      value: 'provides_post-cancellation_access_for',
      label: 'Provides post-cancellation access for'
    },
    inward: {
      value: 'has-post-cancellation-access-in',
      label: 'Has post-cancellation access in',
    },
  },
  {
    type: 'tracks_demand-driven_acquisitions_for',
    outward: {
      value: 'tracks_demand-driven_acquisitions_for',
      label: 'Tracks demand-driven acquisitions for',
    },
    inward: {
      value: 'has-demand-driven-acquisitions-in',
      label: 'Has demand-driven acquisitions in',
    },
  },
];
