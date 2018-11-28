import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import Link from 'react-router-dom/Link';

import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';

class PackageResources extends React.Component {
  static manifest = Object.freeze({
    packageContentItems: {
      type: 'okapi',
      path: 'erm/resource',
      records: 'results',
      limitParam: 'perPage',
      perRequest: 100,
      recordsRequired: '1000',
      params: {
        filters: 'pkg.id==:{id}',
        sort: 'pti.titleInstance.name;asc',
        stats: 'true',
      },
    },
  });

  static propTypes = {
    id: PropTypes.string,
    match: PropTypes.object, // eslint-disable-line
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    resources: PropTypes.shape({
      packageContentItems: PropTypes.object,
    }),
  };

  render() {
    const resources = get(this.props.resources, ['packageContentItems', 'records'], []);

    return (
      <Accordion
        id={this.props.id}
        label="E-resources in package"
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <MultiColumnList
          contentData={resources}
          interactive={false}
          columnMapping={{
            name: <FormattedMessage id="ui-agreements.eresources.name" />,
            platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
            coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
          }}
          columnWidths={{
            coverage: 300,
          }}
          formatter={{
            name: pci => {
              const { id, name } = pci._object.pti.titleInstance;
              return <Link to={`/erm/eresources/view/${id}`}>{name}</Link>;
            },
            platform: pci => get(pci._object, ['pti', 'platform', 'name'], ''),
            coverage: pci => {
              const coverages = pci._object.coverageStatements || [];
              if (!coverages.length) return null;

              return (
                <React.Fragment>
                  {coverages.map((coverage, i) => <div key={`coverage-${pci.id}-${i}`}>{coverage.summary}</div>)}
                </React.Fragment>
              );
            }
          }}
          visibleColumns={['name', 'platform', 'coverage']}
        />
      </Accordion>
    );
  }
}

export default PackageResources;
