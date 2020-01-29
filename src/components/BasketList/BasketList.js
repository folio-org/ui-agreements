import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  IconButton,
  MultiColumnList,
} from '@folio/stripes/components';

import { Coverage } from '../Coverage';
import EResourceLink from '../EResourceLink';
import EResourceType from '../EResourceType';

class BasketList extends React.Component {
  static propTypes = {
    basket: PropTypes.arrayOf(PropTypes.object),
    onRemoveItem: PropTypes.func,
    onToggleAll: PropTypes.func,
    onToggleItem: PropTypes.func,
    selectedItems: PropTypes.object,
  }

  render() {
    const { basket, onRemoveItem, selectedItems } = this.props;

    return (
      <MultiColumnList
        columnMapping={{
          selected: (
            <Checkbox
              name="selected-all"
              checked={Object.values(selectedItems).includes(false) !== true}
              onChange={this.props.onToggleAll}
            />
          ),
          name: <FormattedMessage id="ui-agreements.eresources.name" />,
          type: <FormattedMessage id="ui-agreements.eresources.type" />,
          package: <FormattedMessage id="ui-agreements.eresources.parentPackage" />,
          publisher: <FormattedMessage id="ui-agreements.eresources.publisher" />,
          platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
          coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
          remove: <FormattedMessage id="ui-agreements.remove" />,
        }}
        columnWidths={{
          name: 300,
        }}
        contentData={basket}
        formatter={{
          selected: resource => (
            <Checkbox
              name={`selected-${resource.id}`}
              checked={!!(selectedItems[resource.id])}
              onChange={() => this.props.onToggleItem(resource)}
            />
          ),
          name: resource => <EResourceLink eresource={resource} />,
          type: resource => <EResourceType resource={resource} />,
          package: resource => {
            const pkg = get(resource, '_object.pkg');
            if (!pkg) return '-';

            return <EResourceLink eresource={pkg} />;
          },
          publisher: () => 'TBD',
          platform: resource => (
            get(resource, '_object.pti.platform.name') ||
            get(resource, '_object.nominalPlatform.name') || '-'
          ),
          // The resource below fits the same shape as the eresources in an agreement line, so we pass them in the isLine prop.
          coverage: resource => {
            console.log(resource)
            return(
          <Coverage coveredEResource={resource} />)
        },
          remove: resource => (
            <FormattedMessage id="ui-agreements.basket.removeItem">
              {ariaLabel => (
                <IconButton
                  aria-label={ariaLabel}
                  icon="trash"
                  onClick={() => onRemoveItem(resource)}
                />
              )}
            </FormattedMessage>
          )
        }}
        interactive={false}
        maxHeight={400}
        rowUpdater={resource => selectedItems[resource.id]}
        visibleColumns={[
          'selected',
          'name',
          'type',
          'package',
          'platform',
          'coverage',
          'remove'
        ]}
      />
    );
  }
}

export default BasketList;
