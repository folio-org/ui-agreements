import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export const LINE_LISTING_COLUMN_MAPPING = {
  name: <FormattedMessage id="ui-agreements.eresources.nameDescription" />,
  provider: <FormattedMessage id="ui-agreements.eresources.provider" />,
  publicationType: <FormattedMessage id="ui-agreements.eresources.publicationType" />,
  count: <FormattedMessage id="ui-agreements.agreementLines.count" />,
  note: <FormattedMessage id="ui-agreements.note" />,
  coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
  isCustomCoverage: <FormattedMessage id="ui-agreements.agreementLines.customCoverageIndicator" />,
  activeFrom: <FormattedMessage id="ui-agreements.eresources.activeFrom" />,
  activeTo: <FormattedMessage id="ui-agreements.eresources.activeTo" />,
  poLines: <FormattedMessage id="ui-agreements.agreementLines.polines" />,
};

export const AGREEMENT_LINES_COLUMN_MAPPING = {
  name: <FormattedMessage id="ui-agreements.agreementLines.nameReference" />,
  description: <FormattedMessage id="ui-agreements.agreementLines.description" />,
  owner: <FormattedMessage id="ui-agreements.line.parentAgreement" />,
  note: <FormattedMessage id="ui-agreements.agreementLines.note" />,
  activeFrom: <FormattedMessage id="ui-agreements.agreementLines.activeFrom" />,
  activeTo: <FormattedMessage id="ui-agreements.agreementLines.activeTo" />,
};
