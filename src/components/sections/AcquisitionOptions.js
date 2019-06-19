import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import AddToBasketButton from '../AddToBasketButton';
import ResourceKB from '../ResourceKB';
import ResourceType from '../ResourceType';
import isPackage from '../utilities/isPackage';
import EResourceLink from '../EResourceLink';

export default class AcquisitionOptions extends React.Component {
  static propTypes = {
  };

  render() {
    const { eresource, options } = this.props;

    if (!options) return <Spinner />;

    return (
      <Accordion
        closedByDefault
        label={<FormattedMessage id="ui-agreements.eresources.acqOptions" values={eresource} />}
      >
        <MultiColumnList
          contentData={options}
          interactive={false}
          visibleColumns={['sourceKb', 'package', 'platform', 'acqMethod', 'add']}
          formatter={{
            sourceKb: option => <ResourceKB resource={option} />,
            package: option => <EResourceLink eresource={option} />,
            platform: option => get(option, '_object.pti.platform.name', '-'),
            acqMethod: option => <ResourceType resource={option} />,
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
                  addLabel={<Icon icon="plus-sign">{addLabel}</Icon>}
                  buttonProps={buttonProps}
                  item={option}
                  key={option.id}
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
            sourceKb: '15%',
            package: '25%',
            platform: '25%',
            acqMethod: '15%',
            add: '25%',
          }}
        />
      </Accordion>
    );
  }
}
