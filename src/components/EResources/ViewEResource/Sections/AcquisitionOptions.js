import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';


class AcquisitionOptions extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  render() {
    const { eresource, stripes: { intl } } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.eresources.acqOptions' }, eresource)}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            TBD
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default AcquisitionOptions;
