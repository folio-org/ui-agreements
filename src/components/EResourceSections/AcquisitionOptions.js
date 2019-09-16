import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, Icon, MultiColumnList } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import AddToBasketButton from '../AddToBasketButton';
import EResourceLink from '../EResourceLink';
import EResourceKB from '../EResourceKB';
import EResourceType from '../EResourceType';

import { isPackage } from '../utilities';

export default class AcquisitionOptions extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      entitlementOptions: PropTypes.array,
      eresource: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
  };

  renderOptions = () => (
    <MultiColumnList
      contentData={this.props.data.entitlementOptions}
      interactive={false}
      visibleColumns={['sourceKb', 'package', 'platform', 'acqMethod', 'add']}
      formatter={{
        sourceKb: option => <EResourceKB resource={option} />,
        package: option => <EResourceLink eresource={option} />,
        platform: option => get(option, '_object.pti.platform.name', '-'),
        acqMethod: option => <EResourceType resource={option} />,
        add: option => {
          const optionIsPackage = isPackage(option);

          const addLabel = optionIsPackage ?
            <FormattedMessage id="ui-agreements.eresources.addPackage" /> :
            <FormattedMessage id="ui-agreements.eresources.addTitle" />;

          const buttonProps = optionIsPackage ?
            { 'data-test-add-package-to-basket': true } :
            { 'data-test-add-title-to-basket': true };

          return (
            <AddToBasketButton
              key={option.id}
              addLabel={<Icon icon="plus-sign">{addLabel}</Icon>}
              item={option}
              buttonProps={buttonProps}
            />
          );
        },
      }}
      columnMapping={{
        sourceKb: <FormattedMessage id="ui-agreements.eresources.sourceKb" />,
        package: <FormattedMessage id="ui-agreements.eresources.parentPackage" />,
        platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
        acqMethod: <FormattedMessage id="ui-agreements.eresources.acqMethod" />,
        add: <FormattedMessage id="ui-agreements.eresources.addToBasketHeader" />,
      }}
      columnWidths={{
        sourceKb: '10%',
        package: '25%',
        platform: '25%',
        acqMethod: '10%',
        add: '25%',
      }}
    />
  )

  renderLoading = () => (
    <Spinner />
  )

  renderBadge = () => {
    const count = get(this.props.data, 'entitlementOptions.length');
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const { data: { entitlementOptions, eresource } } = this.props;

    return (
      <Accordion
        id="eresource-acquisition-options"
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        label={<FormattedMessage id="ui-agreements.eresources.acqOptions" values={eresource} />}
      >
        {entitlementOptions ? this.renderOptions() : this.renderLoading()}
      </Accordion>
    );
  }
}
