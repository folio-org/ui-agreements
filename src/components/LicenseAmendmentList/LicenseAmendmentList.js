import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import { IconButton, Icon, MultiColumnList, Tooltip } from '@folio/stripes/components';
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
    const startDate = amendment.startDate ? amendment.startDate : null;
    const endDate = amendment.endDate ? amendment.endDate : null;

    if (agreementStatus) {
      // Warnings only show up for current amendments
      if (agreementStatus === statuses.CURRENT) {

        // Check if there is a conflict of status expired or rejected
        if (licenseStatus === statuses.EXPIRED || licenseStatus === statuses.REJECTED) {
          return <FormattedMessage id="ui-agreements.license.warn.amendmentStatus" values={{ status: licenseStatusLabel }} />
        }
        // If amendment has a startDate, check it's not in the future 
        else if (startDate) {
          if (new Date(amendment.startDate).getTime() > new Date().getTime()) {
            return <FormattedMessage id="ui-agreements.license.warn.amendmentFuture" />;
          } else {
            return null;
          }
        }
        // If amendment has a endDate, check it's not in the past
        else if (endDate) {
          if (new Date(amendment.endDate).getTime() < new Date().getTime()) {
            return <FormattedMessage id="ui-agreements.license.warn.amendmentPast" />;
          } else {
            return null;
          }
        }               
        else {
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
      renderWarnings,
      renderNotes,
    } = this.props;

    let columns = ['warning', 'name', 'status', 'startDate', 'endDate', 'note'];
    columns = renderStatuses ? columns : columns.filter(column => column !== 'status');
    columns = renderWarnings ? columns : columns.filter(column => column !== 'warning');
    columns = renderNotes ? columns : columns.filter(column => column !== 'note');

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
        columnWidths={{
          note: '350px'
        }}
        contentData={amendments}
        formatter={{
          warning: a => (
            this.renderStatusMismatchWarnings(a) ? 
              <Tooltip
                id={`warning-tooltip-${a.id}`}
                text={this.renderStatusMismatchWarnings(a)}
                placement="left"
              >
                {({ ref, ariaIds }) => (
                  <span ref={ref} aria-label={ariaIds.text}>
                    <Icon
                      icon='exclamation-circle'
                      iconClassName={css.tooltipIcon}
                    />
                  </span>
                )}
              </Tooltip> : ''
            ),
          note: a => (a.note ? a.note : ''),
          name: a => <Link to={urls.amendmentView(license.id, a.id)}>{a.name}</Link>,
          status: a => (a.status ? a.status.label : '-'),
          startDate: a => (a.startDate ? <FormattedUTCDate value={a.startDate} /> : '-'),
          endDate: a => <LicenseEndDate license={a} />,
        }}
        id={id}
        interactive={false}
        visibleColumns={columns}
      />
    );
  }
}
