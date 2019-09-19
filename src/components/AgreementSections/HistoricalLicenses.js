import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, Layout } from '@folio/stripes/components';

import LinkedLicenseCard from '../LinkedLicenseCard';
import { statuses } from '../../constants';

export default class HistoricalLicenses extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      linkedLicenses: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
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
    return (
      <LinkedLicenseCard
        id={`agreement-historical-license-${i}`}
        key={linkedLicense.id}
        license={linkedLicense}
      />
    );
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.license.noHistoricalLicenses" />
    </Layout>
  )

  render() {
    const { id, onToggle, open } = this.props;

    const licenses = get(this.props, 'agreement.linkedLicenses', [])
      .filter(l => get(l, 'status.value') === statuses.HISTORICAL);

    return (
      <Accordion
        displayWhenClosed={<Badge>{licenses.length}</Badge>}
        displayWhenOpen={<Badge>{licenses.length}</Badge>}
        id={id}
        label={<FormattedMessage id="ui-agreements.license.historicalLicenses" />}
        open={open}
        onToggle={onToggle}
      >
        { licenses.length ? licenses.map(this.renderLicense) : this.renderEmpty() }
      </Accordion>
    );
  }
}
