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
import { getLicenseAmendments, urls } from '../utilities';
import { statuses } from '../../constants';

export default class FutureLicenses extends React.Component {
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

  renderLicense = (linkedLicense, i) => {
    const amendments = getLicenseAmendments(linkedLicense);
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
        id={`agreement-future-license-${i}`}
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
        { amendments.length ?
          <LicenseAmendmentList
            amendments={amendments}
            id={`agreement-future-license-${i}-amendments`}
            license={licenseRecord}
          />
          : null
        }
      </Card>
    );
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.license.noFutureLicenses" />
    </Layout>
  )

  render() {
    const { id, onToggle, open } = this.props;

    const licenses = get(this.props, 'agreement.linkedLicenses', [])
      .filter(l => l.status.value === statuses.FUTURE);

    return (
      <Accordion
        displayWhenClosed={<Badge>{licenses.length}</Badge>}
        displayWhenOpen={<Badge>{licenses.length}</Badge>}
        id={id}
        label={<FormattedMessage id="ui-agreements.license.futureLicenses" />}
        open={open}
        onToggle={onToggle}
      >
        { licenses.length ? licenses.map(this.renderLicense) : this.renderEmpty() }
      </Accordion>
    );
  }
}
