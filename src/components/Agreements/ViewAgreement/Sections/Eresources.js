import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Accordion, Col, Row } from '@folio/stripes/components';

import EresourceAgreementLines from './EresourceAgreementLines';
import EresourcesCovered from './EresourcesCovered';

class Eresources extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    intl: intlShape,
  };

  state = {
    eResourcesCoveredOpen: true,
  }

  onToggleEresourcesCovered = () => {
    this.setState((prevState) => ({
      eResourcesCoveredOpen: !prevState.eResourcesCoveredOpen,
    }));
  }

  render() {
    const { intl } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-agreements.agreements.eresourceAgreementLines' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <EresourceAgreementLines {...this.props} />
          </Col>
        </Row>
        <Accordion
          id="eresources-covered"
          label={intl.formatMessage({ id: 'ui-agreements.agreements.eresourcesCovered' })}
          open={this.state.eResourcesCoveredOpen}
          onToggle={this.onToggleEresourcesCovered}
        >
          <Row>
            <Col xs={12}>
              <EresourcesCovered {...this.props} />
            </Col>
          </Row>
        </Accordion>
      </Accordion>
    );
  }
}

export default injectIntl(Eresources);
