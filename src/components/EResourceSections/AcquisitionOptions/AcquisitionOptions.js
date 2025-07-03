import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, MultiColumnList, NoValue, Spinner } from '@folio/stripes/components';

import {
  EResourceType,
  isPackage,
  TitleOnPlatformLink
} from '@folio/stripes-erm-components';
import { usePrevNextPagination } from '@k-int/stripes-kint-components';

import AddToBasketButton from '../../AddToBasketButton';
import Coverage from '../../Coverage';
import EResourceKB from '../../EResourceKB';

import { isExternal, parseMclPageSize } from '../../utilities';
import { resourceClasses, ENTITLEMENT_OPTIONS_PAGINATION_ID } from '../../../constants';
import { useAgreementsDisplaySettings } from '../../../hooks';

const propTypes = {
  data: PropTypes.shape({
    areEntitlementOptionsLoading: PropTypes.bool,
    entitlementOptions: PropTypes.arrayOf(PropTypes.object),
    entitlementOptionsCount: PropTypes.number,
    eresource: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
  }),
  handlers: PropTypes.shape({
    onEResourceClick: PropTypes.func,
  }),
  id: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
};

const AcquisitionOptions = ({
  data: {
    areEntitlementOptionsLoading,
    entitlementOptions,
    entitlementOptionsCount,
    eresource: { id: eresourceId },
  },
  handlers: { onEResourceClick },
  id,
  isLoading
}) => {
  const settings = useAgreementsDisplaySettings();
  const entitlementOptionsPageSize = parseMclPageSize(settings, 'entitlementOptions');

  const {
    paginationMCLProps,
  } = usePrevNextPagination({
    count: entitlementOptionsCount,
    pageSize: entitlementOptionsPageSize,
    id: `${ENTITLEMENT_OPTIONS_PAGINATION_ID}-${eresourceId}`,
    syncToLocation: false
  });

  const getName = (eresource = {}) => {
    if (isExternal(eresource)) {
      return eresource.reference_object?.label;
    }

    return eresource.name;
  };

  const onRowClick = (_, row) => {
    const { id: rowId, class: clazz } = row;

    // Redirect to Package view if package, title view otherwise
    onEResourceClick(rowId, clazz === resourceClasses?.PACKAGE ? 'PKG' : 'TITLE');
  };

  const renderBadge = () => {
    const count = entitlementOptionsCount ?? 0;
    return (count !== undefined && !isLoading) ? <Badge>{count}</Badge> : <Spinner />;
  };

  const renderParentPackage = (eresource) => {
    const name = getName(eresource);

    return (
      <div data-test-eresource-name style={{ overflowWrap: 'break-word', width: 180 }}>
        {name || <NoValue />}
      </div>
    );
  };

  const renderOptions = () => (
    <MultiColumnList
      columnMapping={{
        sourceKb: <FormattedMessage id="ui-agreements.eresources.dataSource" />,
        package: <FormattedMessage id="ui-agreements.eresources.name" />,
        coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
        platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
        acqMethod: <FormattedMessage id="ui-agreements.eresources.acqMethod" />,
        add: <FormattedMessage id="ui-agreements.eresources.addToBasketHeader" />,
      }}
      columnWidths={{
        sourceKb: 90,
        package: 200,
        coverage: 220,
        platform: 200,
        acqMethod: 100
      }}
      contentData={entitlementOptions}
      formatter={{
        sourceKb: option => <EResourceKB resource={option} />,
        package: option => renderParentPackage(option),
        coverage: option => <Coverage eResource={option} />,
        platform: option => {
          const pti = option?._object?.pti ?? {};
          const { name, platform, url } = pti;

          return (
            <TitleOnPlatformLink
              id={option.id}
              name={name}
              platform={platform?.name}
              url={url}
            />
          );
        },
        acqMethod: option => <EResourceType resource={option} />,
        add: option => {
          const optionIsPackage = isPackage(option);
          const packageName = isExternal(option) ? option.reference_object.label : option.name;

          const addLabel = optionIsPackage ?
            <FormattedMessage id="ui-agreements.eresources.addPackage" /> :
            <FormattedMessage id="ui-agreements.eresources.addTitle" />;

          const addButtonTooltipText = optionIsPackage ?
            <FormattedMessage id="ui-agreements.eresources.addPackageButtonTooltip" values={{ packageName }} /> :
            <FormattedMessage id="ui-agreements.eresources.addTitleButtonTooltip" values={{ packageName }} />;

          const removeLabel = optionIsPackage ?
            <FormattedMessage id="ui-agreements.eresources.removePackage" /> :
            <FormattedMessage id="ui-agreements.eresources.removeTitle" />;

          const removeButtonTooltipText = optionIsPackage ?
            <FormattedMessage id="ui-agreements.eresources.removePackageButtonTooltip" values={{ packageName }} /> :
            <FormattedMessage id="ui-agreements.eresources.removeTitleButtonTooltip" values={{ packageName }} />;

          const buttonProps = optionIsPackage ?
            { 'data-test-add-package-to-basket': true } :
            { 'data-test-add-title-to-basket': true };

          return (
            <AddToBasketButton
              key={option.id}
              addButtonTooltipText={addButtonTooltipText}
              addLabel={addLabel}
              buttonProps={buttonProps}
              item={option}
              removeButtonTooltipText={removeButtonTooltipText}
              removeLabel={removeLabel}
            />
          );
        },
      }}
      id={`${id}-mcl`}
      onRowClick={onRowClick}
      pagingType="click"
      totalCount={entitlementOptionsCount}
      visibleColumns={['sourceKb', 'package', 'coverage', 'platform', 'acqMethod', 'add']}
      {...paginationMCLProps}
    />
  );
  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={renderBadge()}
      id={id}
      label={<FormattedMessage id="ui-agreements.eresources.acqOptions" />}
    >
      {(entitlementOptions && !areEntitlementOptionsLoading) ? renderOptions() : <Spinner />}
    </Accordion>
  );
};

AcquisitionOptions.propTypes = propTypes;
export default AcquisitionOptions;
