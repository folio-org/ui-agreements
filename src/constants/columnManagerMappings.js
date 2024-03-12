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

export const AGREEMENTS_COLUMN_MAPPING = {
  name: <FormattedMessage id="ui-agreements.agreements.name" />,
  agreementStatus: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
  startDate: <FormattedMessage id="ui-agreements.agreements.startDate" />,
  endDate: <FormattedMessage id="ui-agreements.agreements.endDate" />,
  cancellationDeadline: <FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />,
  description: <FormattedMessage id="ui-agreements.agreements.agreementDescription" />,
};
