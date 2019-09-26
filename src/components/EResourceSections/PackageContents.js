import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, MultiColumnList } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import CoverageStatements from '../CoverageStatements';
import EResourceLink from '../EResourceLink';
import FormattedUTCDate from '../FormattedUTCDate';

export default class PackageContents extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      packageContents: PropTypes.array,
    }),
  };

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    accessStart: <FormattedMessage id="ui-agreements.eresources.accessStart" />,
    accessEnd: <FormattedMessage id="ui-agreements.eresources.accessEnd" />,
  }

  formatter = {
    name: pci => <EResourceLink eresource={pci._object.pti.titleInstance} />,
    platform: pci => get(pci._object, 'pti.platform.name', ''),
    coverage: pci => <CoverageStatements statements={pci._object.coverage} />,
    accessStart: pci => this.renderDate(get(pci._object, 'accessStart')),
    accessEnd: pci => this.renderDate(get(pci._object, 'accessEnd')),
  }

  visibleColumns = [
    'name',
    'platform',
    'coverage',
    'accessStart',
    'accessEnd',
  ]

  renderOptions = (packageContents) => (
    <MultiColumnList
      columnMapping={this.columnMapping}
      contentData={packageContents}
      formatter={this.formatter}
      id="packageContents-list"
      visibleColumns={this.visibleColumns}
    />
  )

  renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : '-'
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
        { packageContents ? this.renderOptions(packageContents) : this.renderLoading() }
      </Accordion>
    );
  }
}
