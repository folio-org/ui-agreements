import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Accordion, Badge, Row } from '@folio/stripes/components';
import { urls } from '../../utilities';

export default class FormLines extends React.Component {
  static propTypes = {
    agreementId: PropTypes.string,
    agreementLineCount: PropTypes.number,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderBadge = () => {
    const { agreementLineCount } = this.props;
    const count = agreementLineCount ?? 0;
    return <Badge>{count}</Badge>;
  }

  render() {
    const { agreementId, agreementLineCount, onToggle, open } = this.props;

    const containerStyle = { marginLeft: '1rem' };
    const rowStyle = { marginBottom: '1rem' };

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id="formLines"
        label={<FormattedMessage id="ui-agreements.agreementLines" />}
        onToggle={onToggle}
        open={open}
      >
        <div style={containerStyle}>
          {(agreementId && agreementLineCount > 0) ?
            <>
              <Row style={rowStyle}>
                <FormattedMessage id="ui-agreements.agreements.agreementLineCount" values={{ count: agreementLineCount }} />
              </Row>
              <Row style={rowStyle}>
                <Link
                  data-test-agreement-lines-link
                  target="_blank"
                  to={`${urls.agreementLines()}?filters=agreement.${agreementId}`}
                >
                  <strong>
                    <FormattedMessage id="ui-agreements.agreementLines.viewInSearch" />
                    {' '}
                    <FormattedMessage id="ui-agreements.open.linkInNewTab" />
                  </strong>
                </Link>
              </Row>
            </>
            :
            <FormattedMessage id="ui-agreements.agreementLines.noLines" />
          }
        </div>
      </Accordion>

    );
  }
}
