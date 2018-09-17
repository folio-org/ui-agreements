import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Col,
  MultiColumnList,
  Row,
} from '@folio/stripes-components';

class AgreementLines extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  render() {
    const { agreementLines, stripes: { intl } } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.agreements.agreementLines' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <MultiColumnList
              contentData={agreementLines}
              maxHeight={400}
              visibleColumns={['name', 'type']}
              formatter={{
                name: line => line.entitlementLabel,
                type: line => line.entitlementType,
              }}
              columnWidths={{
                name: '50%',
                type: '50%',
              }}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default AgreementLines;
