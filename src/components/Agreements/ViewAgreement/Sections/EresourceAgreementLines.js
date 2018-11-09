import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';

import {
  MultiColumnList,
} from '@folio/stripes/components';

import { renderResourceType } from '../../../../util/resourceType';

class EresourceAgreementLines extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    intl: intlShape,
  };

  render() {
    const { agreementLines, intl } = this.props;

    return (
      <MultiColumnList
        contentData={agreementLines}
        interactive={false}
        maxHeight={400}
        visibleColumns={[
          'name',
          'platform',
          'type',
          'count',
          'contentUpdated',
        ]}
        formatter={{
          name: line => {
            const resource = get(line.resource, ['_object', 'pti', 'titleInstance'], line.resource);
            return <Link to={`/erm/eresources/view/${resource.id}`}>{resource.name}</Link>;
          },
          platform: line => (
            get(line, ['resource', '_object', 'pti', 'platform', 'name']) ||
            get(line, ['resource', '_object', 'nominalPlatform', 'name'])
          ),
          type: line => renderResourceType(line.resource),
          count: line => (get(line, ['_object', 'contentItems'], [0])).length, // If contentItems doesn't exist there's only one item.
          contentUpdated: () => 'TBD',
        }}
        columnMapping={{
          name: intl.formatMessage({ id: 'ui-agreements.eresources.name' }),
          platform: intl.formatMessage({ id: 'ui-agreements.eresources.platform' }),
          type: intl.formatMessage({ id: 'ui-agreements.eresources.erType' }),
          count: intl.formatMessage({ id: 'ui-agreements.agreementLines.count' }),
          contentUpdated: intl.formatMessage({ id: 'ui-agreements.agreementLines.contentUpdated' }),
        }}
        columnWidths={{
          name: '20%',
          platform: '20%',
          type: '10%',
        }}
      />
    );
  }
}

export default injectIntl(EresourceAgreementLines);
