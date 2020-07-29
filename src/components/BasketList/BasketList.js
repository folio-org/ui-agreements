import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  IconButton,
  MultiColumnList,
} from '@folio/stripes/components';

import { EResourceType } from '@folio/stripes-erm-components';
import { Coverage } from '../Coverage';
import EResourceLink from '../EResourceLink';

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
              checked={Object.values(selectedItems).includes(false) !== true}
              name="selected-all"
              onChange={this.props.onToggleAll}
            />
          ),
          name: <FormattedMessage id="ui-agreements.eresources.name" />,
          publicationType: <FormattedMessage id="ui-agreements.eresources.publicationType" />,
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
              checked={!!(selectedItems[resource.id])}
              name={`selected-${resource.id}`}
              onChange={() => this.props.onToggleItem(resource)}
            />
          ),
          name: resource => <EResourceLink eresource={resource} />,
          publicationType: resource => <EResourceType resource={resource} />,
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
          // The resource below fits the same shape as the eresources in an agreement line, so we pass them in the eResource prop.
          coverage: resource => <Coverage eResource={resource} />,
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
          'publicationType',
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
