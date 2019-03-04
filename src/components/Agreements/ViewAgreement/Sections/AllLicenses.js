import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion, Layout } from '@folio/stripes/components';
import { DocumentCard } from '@folio/stripes-erm-components';

export default class ExternalLicenses extends React.Component {
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

  renderExternalLicenses = (licenses) => (
    licenses.map(license => <DocumentCard key={license.id} {...license} />)
  )

  render() {
    const licenses = get(this.props, ['agreement', 'licenses'], []);

    return (
      <Accordion
        id="agreement-external-licenses"
        label={<FormattedMessage id="ui-agreements.license.allLicenses" />}
      >
        <Layout className="margin-start-gutter padding-bottom-gutter">
          { licenses.length ?
            this.renderLicenses(licenses) :
            <FormattedMessage id="ui-agreements.license.noLicenses" />
          }
        </Layout>
      </Accordion>
    );
  }
}
