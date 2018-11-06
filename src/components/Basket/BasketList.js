import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { injectIntl, intlShape } from 'react-intl';

import {
  Checkbox,
  Col,
  IconButton,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';

import { renderResourceType } from '../../util/resourceType';

class BasketList extends React.Component {
  static propTypes = {
    basket: PropTypes.arrayOf(PropTypes.object),
    intl: intlShape,
    onToggleAll: PropTypes.func,
    onToggleItem: PropTypes.func,
    removeItem: PropTypes.func,
    selectedItems: PropTypes.object,
  }

  render() {
    const { basket, intl, removeItem, selectedItems } = this.props;

    return (
      <Row>
        <Col xs={12}>
          <MultiColumnList
            contentData={basket}
            interactive={false}
            maxHeight={400}
            visibleColumns={[
              'selected',
              'name',
              'type',
              'package',
              'publisher',
              'platform',
              'coverageStart',
              'coverageEnd',
              'remove'
            ]}
            formatter={{
              selected: resource => (
                <Checkbox
                  name={`selected-${resource.id}`}
                  checked={!!(selectedItems[resource.id])}
                  onChange={() => this.props.onToggleItem(resource)}
                />
              ),
              name: resource => <Link to={`/erm/eresources/view/${resource.id}`}>{resource.name}</Link>,
              type: resource => renderResourceType(resource),
              package: resource => {
                const pkg = get(resource, ['_object', 'pkg']);
                if (!pkg) return '';

                return <Link to={`/erm/eresources/view/${pkg.id}`}>{pkg.name}</Link>;
              },
              publisher: () => 'TBD',
              platform: resource => (
                get(resource, ['_object', 'pti', 'platform', 'name']) ||
                get(resource, ['_object', 'nominalPlatform', 'name'])
              ),
              coverageStart: () => 'TBD',
              coverageEnd: () => 'TBD',
              remove: resource => (
                <IconButton
                  aria-label={intl.formatMessage({ id: 'ui-erm.basket.removeItem' })}
                  icon="trashBin"
                  onClick={() => removeItem(resource)}
                />
              )
            }}
            columnMapping={{
              selected: (
                <Checkbox
                  name="selected-all"
                  checked={Object.values(selectedItems).includes(false) !== true}
                  onChange={this.props.onToggleAll}
                />
              ),
              name: intl.formatMessage({ id: 'ui-erm.eresources.name' }),
              type: intl.formatMessage({ id: 'ui-erm.eresources.type' }),
              package: intl.formatMessage({ id: 'ui-erm.eresources.parentPackage' }),
              publisher: intl.formatMessage({ id: 'ui-erm.eresources.publisher' }),
              platform: intl.formatMessage({ id: 'ui-erm.eresources.platform' }),
              coverageStart: intl.formatMessage({ id: 'ui-erm.eresources.coverageStart' }),
              coverageEnd: intl.formatMessage({ id: 'ui-erm.eresources.coverageEnd' }),
              remove: intl.formatMessage({ id: 'ui-erm.remove' }),
            }}
            columnWidths={{
              name: '30%',
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default injectIntl(BasketList);
