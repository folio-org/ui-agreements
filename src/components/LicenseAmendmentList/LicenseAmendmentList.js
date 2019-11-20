import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import { InfoPopover, MultiColumnList, Tooltip } from '@folio/stripes/components';
import { LicenseEndDate } from '@folio/stripes-erm-components';

import { statuses } from '../../constants';
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
    const licenseStatusLabel = amendment.status ? amendment.status.label : null;
    const agreementStatus = amendment.statusForThisAgreement ? amendment.statusForThisAgreement.value : null;
    if (agreementStatus) {
      if (agreementStatus === statuses.CURRENT) {
        console.log("Agreement status is current")
        if (licenseStatus === statuses.EXPIRED || licenseStatus === statuses.REJECTED) {
          console.log("Conflict detected")
          return <FormattedMessage id="ui-agreements.license.warn.amendmentStatus" values={{ status: licenseStatusLabel }} />
        } else {
          return null;
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
          warning: '',
          note: <FormattedMessage id="ui-agreements.note" />,
          name: <FormattedMessage id="ui-agreements.license.amendment" />,
          status: <FormattedMessage id="ui-agreements.status" />,
          startDate: <FormattedMessage id="ui-agreements.license.prop.startDate" />,
          endDate: <FormattedMessage id="ui-agreements.license.prop.endDate" />,
        }}
        columnWidths={{note: '350px'}}
        contentData={amendments}
        formatter={{
          //warning: a => (this.renderStatusMismatchWarnings(a) ? <InfoPopover contentClass={css.note} content={this.renderStatusMismatchWarnings(a)} /> : ''),
          warning: a => (this.renderStatusMismatchWarnings(a) ? <InfoPopover contentClass={css.note} content={this.renderStatusMismatchWarnings(a)} /> : ''),
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
            ['warning', 'name', 'status', 'startDate', 'endDate', 'note'] :
            ['warning', 'name', 'startDate', 'endDate', 'note']
        }
      />
    );
  }
}
