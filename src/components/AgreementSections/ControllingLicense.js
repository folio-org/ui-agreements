import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Card,
  Badge,
  KeyValue,
  Layout,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { LicenseCard } from '@folio/stripes-erm-components';

import LicenseAmendmentList from '../LicenseAmendmentList';
import { urls } from '../utilities';
import { statuses } from '../../constants';

export default class Licenses extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      linkedLicenses: PropTypes.arrayOf(
        PropTypes.shape({
          amendments: PropTypes.arrayOf(PropTypes.shape({
            amendmentId: PropTypes.string.isRequired,
            note: PropTypes.string,
            status: PropTypes.shape({
              value: PropTypes.string,
            }),
          })),
          endDate: PropTypes.string,
          name: PropTypes.string,
          note: PropTypes.string,
          remoteId_object: PropTypes.shape({
            amendments: PropTypes.arrayOf(PropTypes.shape({
              id: PropTypes.string.isRequired
            }))
          }),
          startDate: PropTypes.string,
          status: PropTypes.shape({
            value: PropTypes.string,
          }),
        }),
      ),
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  getAmendments = (linkedLicense, status) => {
    const linkedAmendments = linkedLicense.amendments || [];
    const licenseRecord = linkedLicense.remoteId_object || {};
    const licenseAmendments = licenseRecord.amendments || [];

    // We want /all/ the amendments for the license (including those created after
    // this agreement was last edited), so we have to start from the license record's amendments.
    return licenseAmendments
      .map(a => {
        // Merge the assigned amendment (containing note/status) with the full amendment record.
        const assignedAmendment = linkedAmendments.find(la => la.amendmentId === a.id) || {};
        return {
          ...a,
          note: assignedAmendment.note,
          statusThisAgreement: assignedAmendment.status,
        };
      })
      .filter(a => get(a, 'statusThisAgreement.value') === status);
  }

  renderLicense = linkedLicense => {
    const currentAmendments = this.getAmendments(linkedLicense, statuses.CURRENT);
    const licenseRecord = linkedLicense.remoteId_object || {};

    return (
      <Card
        cardStyle="positive"
        hasMargin
        headerStart={(
          <AppIcon app="licenses" size="small">
            <Link to={urls.licenseView(licenseRecord.id)}>
              <strong>{licenseRecord.name}</strong>
            </Link>
          </AppIcon>
        )}
        id="agreement-controlling-license"
        roundedBorder
      >
        <LicenseCard
          license={licenseRecord}
          renderName={false}
        />
        { linkedLicense.note &&
          <KeyValue label={<FormattedMessage id="ui-agreements.license.prop.note" />}>
            {linkedLicense.note}
          </KeyValue>
        }
        { currentAmendments.length ?
          <KeyValue label={<FormattedMessage id="ui-agreements.license.currentAmendments" />}>
            <LicenseAmendmentList
              amendments={currentAmendments}
              id="controlling-license-current-amendments"
              license={licenseRecord}
              renderStatuses
            />
          </KeyValue>
          : null
        }
      </Card>
    );
  }

  renderAmendments = (linkedLicense, status) => {
    const amendments = this.getAmendments(linkedLicense, status);

    if (!amendments.length) return null;

    const statusString = status || 'unset';

    return (
      <KeyValue label={<FormattedMessage id={`ui-agreements.license.${statusString}Amendments`} />}>
        <LicenseAmendmentList
          amendments={amendments}
          id={`controlling-license-${statusString}-amendments`}
          license={linkedLicense.remoteId_object}
          renderStatuses={status !== statuses.HISTORICAL}
        />
      </KeyValue>
    );
  }

  render() {
    const { id, onToggle, open } = this.props;

    const license = get(this.props, 'agreement.linkedLicenses', [])
      .find(l => l.status.value === statuses.CONTROLLING);

    return (
      <Accordion
        displayWhenClosed={<Badge>{license ? 1 : 0}</Badge>}
        displayWhenOpen={<Badge>{license ? 1 : 0}</Badge>}
        id={id}
        label={<FormattedMessage id="ui-agreements.license.controllingLicense" />}
        open={open}
        onToggle={onToggle}
      >
        { license ?
          <div>
            {this.renderLicense(license)}
            {this.renderAmendments(license, statuses.FUTURE)}
            {this.renderAmendments(license, statuses.HISTORICAL)}
            {this.renderAmendments(license)}
          </div>
          :
          <Layout className="padding-bottom-gutter">
            <FormattedMessage id="ui-agreements.license.noControllingLicense" />
          </Layout>
        }
      </Accordion>
    );
  }
}
