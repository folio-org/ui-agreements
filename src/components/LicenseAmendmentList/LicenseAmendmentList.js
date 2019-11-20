import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import { InfoPopover, MultiColumnList } from '@folio/stripes/components';
import { LicenseEndDate } from '@folio/stripes-erm-components';

import FormattedUTCDate from '../FormattedUTCDate';
import { urls } from '../utilities';
import css from './LicenseAmendmentList.css';

export default class LicenseAmendmentList extends React.Component {
  static propTypes = {
    amendments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      note: PropTypes.string,
      startDate: PropTypes.string,
      status: PropTypes.shape({
        label: PropTypes.string,
      }),
    })),
    id: PropTypes.string,
    license: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    renderStatuses: PropTypes.bool,
  }

  renderStatusMismatchWarnings(amendment) {
    const licenseStatus = amendment.status ? amendment.status.value : null;
    const agreementStatus = amendment.statusForThisAgreement ? amendment.statusForThisAgreement : null;
    if (agreementStatus) {
      if (agreementStatus === 'current') {
        if (licenseStatus === 'expired') {
          return 
        }
      } else {
        return null;
      }
    } else {
      return null;
    }

  }

  render() {
    const {
      amendments,
      id,
      license,
      renderStatuses,
    } = this.props;

    console.log("Props: %o", this.props)

    return (
      <MultiColumnList
        columnMapping={{
          note: <FormattedMessage id="ui-agreements.note" />,
          name: <FormattedMessage id="ui-agreements.license.amendment" />,
          status: <FormattedMessage id="ui-agreements.status" />,
          startDate: <FormattedMessage id="ui-agreements.license.prop.startDate" />,
          endDate: <FormattedMessage id="ui-agreements.license.prop.endDate" />,
        }}
        columnWidths={{note: '350px'}}
        contentData={amendments}
        formatter={{
          //note: a => (a.note ? <InfoPopover contentClass={css.note} content={a.note} /> : ''),
          note: a => (a.note ? a.note : ''),
          name: a => <Link to={urls.amendmentView(license.id, a.id)}>{a.name}</Link>,
          status: a => (a.status ? a.status.label : '-'),
          startDate: a => (a.startDate ? <FormattedUTCDate value={a.startDate} /> : '-'),
          endDate: a => <LicenseEndDate license={a} />,
        }}
        id={id}
        interactive={false}
        visibleColumns={
          renderStatuses ?
            ['name', 'status', 'startDate', 'endDate', 'note'] :
            ['name', 'startDate', 'endDate', 'note']
        }
      />
    );
  }
}
