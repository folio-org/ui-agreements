import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, Row } from '@folio/stripes/components';

import EresourceAgreementLines from './EresourceAgreementLines';
import EresourcesCovered from './EresourcesCovered';

export default class Eresources extends React.Component {
  static propTypes = {
    fetchMoreEresources: PropTypes.func,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
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
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.eresourceAgreementLines" />}
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
          label={<FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />}
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
