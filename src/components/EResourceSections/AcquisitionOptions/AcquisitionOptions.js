import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, MultiColumnList, NoValue, Spinner } from '@folio/stripes/components';

import {
  EResourceType,
  isPackage,
  TitleOnPlatformLink
} from '@folio/stripes-erm-components';
import AddToBasketButton from '../../AddToBasketButton';
import Coverage from '../../Coverage';
import EResourceKB from '../../EResourceKB';

import { isExternal } from '../../utilities';
import { resourceClasses } from '../../../constants';

class AcquisitionOptions extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      areEntitlementOptionsLoading: PropTypes.bool,
      entitlementOptions: PropTypes.arrayOf(PropTypes.object),
      entitlementOptionsCount: PropTypes.number,
      eresource: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    handlers: PropTypes.shape({
      onEResourceClick: PropTypes.func,
      onNeedMoreEntitlementOptions: PropTypes.func,
    }),
    id: PropTypes.string,
  };

  getName = (eresource = {}) => {
    if (isExternal(eresource)) {
      return eresource.reference_object?.label;
    }

    return eresource.name;
  }

  onRowClick = (_, row) => {
    const { id, class: clazz } = row;
    const { handlers: { onEResourceClick } } = this.props;

    // Redirect to Package view if package, title view otherwise
    onEResourceClick(id, clazz === resourceClasses?.PACKAGE ? 'PKG' : 'TITLE');
  }

  renderBadge = () => {
    const { entitlementOptionsCount: count, areEntitlementOptionsLoading: isLoading } = this.props?.data;
    return (count !== undefined && !isLoading) ? <Badge>{count}</Badge> : <Spinner />;
  }

  renderParentPackage = (eresource) => {
    const name = this.getName(eresource);

    return (
      <div data-test-eresource-name style={{ overflowWrap: 'break-word', width: 180 }}>
        {name || <NoValue />}
      </div>
    );
  };

  renderOptions = () => (
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
      contentData={this.props.data.entitlementOptions}
      formatter={{
        sourceKb: option => <EResourceKB resource={option} />,
        package: option => this.renderParentPackage(option),
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
      id={`${this.props.id}-mcl`}
      onNeedMoreData={this.props.handlers.onNeedMoreEntitlementOptions}
      onRowClick={this.onRowClick}
      pagingType="click"
      totalCount={this.props.data.entitlementOptionsCount}
      visibleColumns={['sourceKb', 'package', 'coverage', 'platform', 'acqMethod', 'add']}
    />
  )

  render() {
    const {
      data: { areEntitlementOptionsLoading, entitlementOptions },
      id,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.eresources.acqOptions" />}
      >
        {(entitlementOptions && !areEntitlementOptionsLoading) ? this.renderOptions() : <Spinner />}
      </Accordion>
    );
  }
}

export default AcquisitionOptions;
