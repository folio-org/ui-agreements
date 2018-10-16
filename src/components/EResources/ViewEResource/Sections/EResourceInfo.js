import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { EResourceAgreements } from '.';

class EResourceInfo extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    match: PropTypes.object,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.connectedEResourceAgreements = props.stripes.connect(EResourceAgreements);
  }

  render() {
    const { eresource, stripes: { intl } } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.eresources.erInfo' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={4}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-erm.eresources.erType' })}
              value={(eresource.type && eresource.type.label) || '-'}
            />
          </Col>
        </Row>
        <this.connectedEResourceAgreements
          key={`agreements-${eresource.id}`} // Force a remount when changing which eresource we're viewing
          {...this.props}
        />
      </Accordion>
    );
  }
}

export default EResourceInfo;
