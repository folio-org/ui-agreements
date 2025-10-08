import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


import uniqueId from 'lodash/uniqueId';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';

import {
  Checkbox,
  IconButton,
  MultiColumnList,
  Tooltip,
} from '@folio/stripes/components';

import { EResourceType } from '@folio/stripes-erm-components';
import Coverage from '../Coverage';
import EResourceLink from '../EResourceLink';
import { BASKET_TYPE_GOKB_TITLE, resourceClasses } from '../../constants';

const BasketList = ({
  basket,
  onRemoveItem,
  onToggleAll,
  onToggleItem,
  selectedItems
}) => {
  const getTextName = useCallback((basketItem) => {
    if (basketItem.class === resourceClasses.PACKAGE) {
      return basketItem._object.name ?? basketItem.name;
    }

    if (
      basketItem.class &&
      basketItem.class === resourceClasses.PCI
    ) {
      return (basketItem?._object?.pti ?? basketItem?.pti)?.titleInstance?.name ?? basketItem.name;
    }

    return basketItem.name;
  }, []);

  const renderName = useCallback((basketItem) => {
    if (
      basketItem.class === resourceClasses.PACKAGE ||
      basketItem.class === resourceClasses.PCI
    ) {
      return (
        <AppIcon
          app="agreements"
          iconKey={basketItem.class === resourceClasses.PACKAGE ? 'package' : 'title'}
          size="small"
        >
          <EResourceLink eresource={basketItem} />
        </AppIcon>
      );
    }

    // Link direct to GOKB View if possible
    if (basketItem.type === BASKET_TYPE_GOKB_TITLE) {
      return (
        <Link
          to={`${basketItem.titleUrl}`}
        >
          {basketItem.name}
        </Link>
      );
    }

    // If in doubt, fallback to basketItem name
    return basketItem.name;
  }, []);

  const renderPublicationType = useCallback((basketItem) => {
    // This defaults to "Title" in unknown circumstances
    return <EResourceType resource={basketItem} />;
  }, []);

  const renderPackage = useCallback((basketItem) => {
    if (basketItem.class === resourceClasses.PCI) {
      const pkg = basketItem?._object?.pkg;

      return <EResourceLink eresource={pkg} />;
    }

    if (basketItem.type === BASKET_TYPE_GOKB_TITLE) {
      if (basketItem.pkg) {
        return <EResourceLink eresource={basketItem.pkg} />;
      }
      return basketItem.tipp?.tippPackageName;
    }

    // Fallback to no package rendered
    return null;
  }, []);

  const renderPlatform = useCallback((basketItem) => {
    if (basketItem.class === resourceClasses.PCI) {
      return basketItem?._object?.pti?.platform?.name ||
        basketItem?._object?.nominalPlatform?.name;
    }

    if (basketItem.type === BASKET_TYPE_GOKB_TITLE) {
      return basketItem.tipp?.hostPlatformName;
    }

    return null;
  }, []);

  const renderCoverage = useCallback((basketItem) => {
    if (basketItem.class === resourceClasses.PCI) {
      return <Coverage pci={basketItem._object} />;
    } else if (basketItem.type === BASKET_TYPE_GOKB_TITLE) {
      return <Coverage pci={basketItem.tipp} />;
    }

    return null;
  }, []);

  return (
    <MultiColumnList
      columnMapping={{
        selected: (
          <Checkbox
            checked={Object.values(selectedItems).includes(false) !== true}
            name="selected-all"
            onChange={onToggleAll}
          />
        ),
        name: <FormattedMessage id="ui-agreements.eresources.name" />,
        publicationType: <FormattedMessage id="ui-agreements.eresources.publicationType" />,
        package: <FormattedMessage id="ui-agreements.eresources.parentPackage" />,
        platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
        coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
        action: <FormattedMessage id="ui-agreements.action" />,
      }}
      columnWidths={{
        coverage: { min: 250, max: 320 },
        name: 400,
        package: { max: 400 },
      }}
      contentData={basket}
      formatter={{
        selected: resource => (
          <Checkbox
            checked={!!(selectedItems[resource.id])}
            name={`selected-${resource.id}`}
            onChange={() => onToggleItem(resource)}
          />
        ),
        name: renderName,
        publicationType: renderPublicationType,
        package: renderPackage,
        platform: renderPlatform,
        // The resource below fits the same shape as the eresources in an agreement line, so we pass them in the eResource prop.
        coverage: renderCoverage,
        action: resource => (
          <Tooltip
            id={uniqueId('removeBasketItemBtn')}
            text={<FormattedMessage id="ui-agreements.basket.removeFromBasket" values={{ publicationType: <EResourceType resource={resource} />, name: getTextName(resource) }} />}
          >
            {({ ariaIds, ref }) => (
              <IconButton
                ref={ref}
                aria-labelledby={ariaIds.text}
                icon="trash"
                onClick={() => onRemoveItem(resource)}
              />
            )}
          </Tooltip>
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
        'action'
      ]}
    />
  );
};

BasketList.propTypes = {
  basket: PropTypes.arrayOf(PropTypes.object),
  onRemoveItem: PropTypes.func,
  onToggleAll: PropTypes.func,
  onToggleItem: PropTypes.func,
  selectedItems: PropTypes.object,
};

export default BasketList;
