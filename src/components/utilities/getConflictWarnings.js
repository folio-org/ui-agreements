import React from 'react';
import { FormattedMessage } from 'react-intl';
import statuses from '../../constants/statuses';

const amendmentWarning = (statusInAgreement, statusInLicense, statusInLicenseLabel, startDate, endDate) => {
  if (statusInAgreement === statuses.CURRENT) {
    if (statusInLicense === statuses.EXPIRED || statusInLicense === statuses.REJECTED) {
      return <FormattedMessage id="ui-agreements.license.warn.amendmentStatus" values={{ status: statusInLicenseLabel }} />;
    } else if (startDate && new Date(startDate).getTime() > new Date().getTime()) {
      return <FormattedMessage id="ui-agreements.license.warn.amendmentFuture" />;
    } else if (endDate && new Date(endDate).getTime() < new Date().getTime()) {
      return <FormattedMessage id="ui-agreements.license.warn.amendmentPast" />;
    }
  }
  return null;
};

export default {
  amendmentWarning
};