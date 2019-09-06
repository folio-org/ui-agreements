import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, MultiColumnList } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import CoverageStatements from '../CoverageStatements';
import EResourceLink from '../EResourceLink';

export default class PackageContents extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      packageContents: PropTypes.array,
    }),
  };

  renderOptions = () => (
    <MultiColumnList
      contentData={this.props.data.packageContents}
      interactive={false}
      columnMapping={{
        name: <FormattedMessage id="ui-agreements.eresources.name" />,
        platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
        coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
      }}
      formatter={{
        name: pci => <EResourceLink eresource={pci._object.pti.titleInstance} />,
        platform: pci => get(pci._object, 'pti.platform.name', ''),
        coverage: pci => <CoverageStatements statements={pci._object.coverage} />,
      }}
      visibleColumns={['name', 'platform', 'coverage']}
    />
  )

  renderLoading = () => (
    <Spinner />
  )

  renderBadge = () => {
    const count = get(this.props.data, 'packageContents.length');
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const { data: { packageContents } } = this.props;

    return (
      <Accordion
        id="eresource-acquisition-options"
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        label={<FormattedMessage id="ui-agreements.eresources.packageResources" />}
      >
        { packageContents ? this.renderOptions() : this.renderLoading() }
      </Accordion>
    );
  }
}
