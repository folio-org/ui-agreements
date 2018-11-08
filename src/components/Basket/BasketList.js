import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';

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
    onToggleAll: PropTypes.func,
    onToggleItem: PropTypes.func,
    removeItem: PropTypes.func,
    selectedItems: PropTypes.object,
  }

  render() {
    const { basket, removeItem, selectedItems } = this.props;

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
                <FormattedMessage id="ui-erm.basket.removeItem">
                  {ariaLabel => (
                    <IconButton
                      aria-label={ariaLabel}
                      icon="trashBin"
                      onClick={() => removeItem(resource)}
                    />
                  )}
                </FormattedMessage>
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
              name: <FormattedMessage id="ui-erm.eresources.name" />,
              type: <FormattedMessage id="ui-erm.eresources.type" />,
              package: <FormattedMessage id="ui-erm.eresources.parentPackage" />,
              publisher: <FormattedMessage id="ui-erm.eresources.publisher" />,
              platform: <FormattedMessage id="ui-erm.eresources.platform" />,
              coverageStart: <FormattedMessage id="ui-erm.eresources.coverageStart" />,
              coverageEnd: <FormattedMessage id="ui-erm.eresources.coverageEnd" />,
              remove: <FormattedMessage id="ui-erm.remove" />,
            }}
            columnWidths={{
              selected: 40,
              name: '30%',
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default BasketList;
