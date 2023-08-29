// Defined as a constant here because we use it as a fallback for the query AND within the SASQ initial setup
export const defaultAgreementsQIndex = 'name,alternateNames.name,description';
export const defaultTitlesQIndex = 'name,identifiers.identifier.value,alternateResourceNames.name,description';
