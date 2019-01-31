import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  Accordion,
  Col,
  Icon,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import AddToBasketButton from '../../../AddToBasketButton';
import ResourceKB from '../../../ResourceKB';
import ResourceType from '../../../ResourceType';
import isPackage from '../../../../util/isPackage';
import EResourceLink from '../../../EResourceLink';

class AcquisitionOptions extends React.Component {
  static manifest = Object.freeze({
    entitlementOptions: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlementOptions',
    }
  })

  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    intl: intlShape,
    match: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    resources: PropTypes.shape({
      entitlementOptions: PropTypes.object,
    }),
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.connectedAddToBasketButton = props.stripes.connect(AddToBasketButton);
  }

  render() {
    const { eresource, resources: { entitlementOptions }, intl } = this.props;

    if (!entitlementOptions || !entitlementOptions.records) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.eresources.acqOptions" values={eresource} />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <MultiColumnList
              contentData={entitlementOptions.records}
              interactive={false}
              // maxHeight={400}
              visibleColumns={['sourceKb', 'package', 'platform', 'acqMethod', 'add']}
              formatter={{
                sourceKb: option => <ResourceKB resource={option} />,
                package: option => <EResourceLink eresource={option} />,
                platform: option => get(option, ['_object', 'pti', 'platform', 'name'], '-'),
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
                    <this.connectedAddToBasketButton
                      key={option.id}
                      addLabel={<Icon icon="plus-sign">{addLabel}</Icon>}
                      item={option}
                      buttonProps={buttonProps}
                    />
                  );
                },
              }}
              columnMapping={{
                sourceKb: intl.formatMessage({ id: 'ui-agreements.eresources.sourceKb' }),
                package: intl.formatMessage({ id: 'ui-agreements.eresources.parentPackage' }),
                platform: intl.formatMessage({ id: 'ui-agreements.eresources.platform' }),
                acqMethod: intl.formatMessage({ id: 'ui-agreements.eresources.acqMethod' }),
                add: intl.formatMessage({ id: 'ui-agreements.eresources.addToBasketHeader' }),
              }}
              columnWidths={{
                sourceKb: '15%',
                package: '25%',
                platform: '25%',
                acqMethod: '15%',
                add: '25%',
              }}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default injectIntl(AcquisitionOptions);
