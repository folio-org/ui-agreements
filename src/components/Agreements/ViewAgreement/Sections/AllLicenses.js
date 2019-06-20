import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Headline, Layout, KeyValue, MultiColumnList, InfoPopover } from '@folio/stripes/components';
import { LicenseCard, LicenseEndDate } from '@folio/stripes-erm-components';

export default class AllLicenses extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      licenses: PropTypes.arrayOf(
        PropTypes.shape({
          dateCreated: PropTypes.string,
          lastUpdated: PropTypes.string,
          location: PropTypes.string,
          name: PropTypes.string.isRequired,
          note: PropTypes.string,
          url: PropTypes.string,
        }),
      ),
    }),
  };

  renderControllingLicense = (licenses) => {
    const controllingLicense = licenses.find(l => l.status.value === 'controlling');
    if (!controllingLicense) return null;

    return (
      <Layout id="agreement-controlling-license">
        <Headline faded margin="none" tag="h4">
          <FormattedMessage id="ui-agreements.license.controllingLicense" />
        </Headline>
        <LicenseCard license={controllingLicense.remoteId_object} />
        {controllingLicense.note ?
          <KeyValue label={<FormattedMessage id="ui-agreements.license.prop.note" />}>
            {controllingLicense.note || '-'}
          </KeyValue>
          :
          null
        }
      </Layout>
    );
  }

  renderInactiveLicenses = (licenses) => {
    const inactiveLicenses = licenses.filter(l => l.status.value !== 'controlling');
    if (!inactiveLicenses.length) return null;

    return (
      <div>
        <Headline faded margin="none" tag="h4">
          <FormattedMessage id="ui-agreements.license.inactiveLicenses" />
        </Headline>
        <MultiColumnList
          columnMapping={{
            note: '',
            name: <FormattedMessage id="ui-agreements.license.prop.name" />,
            status: <FormattedMessage id="ui-agreements.license.prop.status" />,
            startDate: <FormattedMessage id="ui-agreements.license.prop.startDate" />,
            endDate: <FormattedMessage id="ui-agreements.license.prop.endDate" />,
          }}
          columnWidths={{
            note: 30,
            name: '40%',
            status: '20%',
            startDate: '15%',
            endDate: '15%'
          }}
          contentData={inactiveLicenses}
          formatter={{
            note: link => (link.note ? <InfoPopover content={link.note} /> : ''),
            name: ({ remoteId_object: license = {} }) => license.name,
            status: link => (link.status ? link.status.label : '-'),
            startDate: ({ remoteId_object: license = {} }) => (license.startDate ? <FormattedDate value={license.startDate} /> : '-'),
            endDate: ({ remoteId_object: license = {} }) => <LicenseEndDate license={license} />,
          }}
          interactive={false}
          visibleColumns={[
            'note',
            'name',
            'status',
            'startDate',
            'endDate',
          ]}
        />
      </div>
    );
  }

  render() {
    const licenses = get(this.props, ['agreement', 'linkedLicenses'], []);

    if (!licenses.length) {
      return (
        <Layout className="padding-bottom-gutter">
          <FormattedMessage id="ui-agreements.license.noLicenses" />
        </Layout>
      );
    }

    return (
      <React.Fragment>
        {this.renderControllingLicense(licenses)}
        {this.renderInactiveLicenses(licenses)}
      </React.Fragment>
    );
  }
}
