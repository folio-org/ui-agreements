import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import {
  Accordion,
  Col,
  Icon,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import AddToBasketButton from '../../../AddToBasketButton';
import { isPackage, renderResourceType } from '../../../../util/resourceType';

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
    const { eresource, resources: { entitlementOptions }, stripes: { intl } } = this.props;

    if (!entitlementOptions || !entitlementOptions.records) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.eresources.acqOptions' }, eresource)}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <MultiColumnList
              contentData={entitlementOptions.records}
              interactive={false}
              // maxHeight={400}
              visibleColumns={['package', 'platform', 'acqMethod', 'add']}
              formatter={{
                package: option => <Link to={`/erm/eresources/view/${option.id}`}>{option.name}</Link>,
                platform: option => get(option, ['_object', 'pti', 'platform', 'name'], '-'),
                acqMethod: option => renderResourceType(option),
                add: option => {
                  const addLabel = isPackage(option) ?
                    intl.formatMessage({ id: 'ui-erm.eresources.addPackage' }) :
                    intl.formatMessage({ id: 'ui-erm.eresources.addTitle' });

                  return (
                    <this.connectedAddToBasketButton
                      key={option.id}
                      addLabel={addLabel}
                      item={option}
                    />
                  );
                },
              }}
              columnMapping={{
                package: intl.formatMessage({ id: 'ui-erm.eresources.parentPackage' }),
                platform: intl.formatMessage({ id: 'ui-erm.eresources.platform' }),
                acqMethod: intl.formatMessage({ id: 'ui-erm.eresources.acqMethod' }),
                add: intl.formatMessage({ id: 'ui-erm.eresources.addToBasketHeader' }),
              }}
              columnWidths={{
                package: '35%',
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

export default AcquisitionOptions;
