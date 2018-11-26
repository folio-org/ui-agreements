import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';

class PackageResources extends React.Component {
  static manifest = Object.freeze({
    packageEresources: {
      type: 'okapi',
      path: 'erm/resource',
      records: 'results',
      limitParam: 'perPage',
      perRequest: 100,
      recordsRequired: '1000',
      params: {
        filters: 'packageOccurences.pkg==:{id}',
        sort: 'titleInstance.name;asc',
        stats: 'true',
      },
    },
    packageEresourcesRequired: { initialValue: 100 },
  });

  static propTypes = {
    id: PropTypes.string,
    match: PropTypes.object, // eslint-disable-line
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    resources: PropTypes.shape({
      packageEresources: PropTypes.object,
    }),
  };

  render() {
    const resources = get(this.props.resources, ['packageEresources', 'records'], []);

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
          }}
          formatter={{
            name: resource => get(resource, ['_object', 'titleInstance', 'name'], ''),
            platform: resource => get(resource, ['_object', 'platform', 'name'], ''),
          }}
          visibleColumns={['name', 'platform']}
        />
      </Accordion>
    );
  }
}

export default PackageResources;
