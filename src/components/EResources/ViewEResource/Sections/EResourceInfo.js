import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';


class EResourceInfo extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    intl: intlShape,
  };

  render() {
    const { eresource, intl } = this.props;

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
      </Accordion>
    );
  }
}

export default injectIntl(EResourceInfo);
