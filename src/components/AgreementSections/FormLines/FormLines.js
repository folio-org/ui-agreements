import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Accordion, Badge, Row } from '@folio/stripes/components';
import { urls } from '../../utilities';

const FormLines = ({ agreementId, agreementLineCount, onToggle, open }) => {
  const renderBadge = () => {
    const count = agreementLineCount ?? 0;
    return <Badge>{count}</Badge>;
  };

  const containerStyle = { marginLeft: '1rem' };
  const rowStyle = { marginBottom: '1rem' };

  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={renderBadge()}
      id="formLines"
      label={<FormattedMessage id="ui-agreements.agreementLines" />}
      onToggle={onToggle}
      open={open}
    >
      <div style={containerStyle}>
        {agreementId && agreementLineCount > 0 ? (
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
        ) : (
          <FormattedMessage id="ui-agreements.agreementLines.noLines" />
        )}
      </div>
    </Accordion>
  );
};

FormLines.propTypes = {
  agreementId: PropTypes.string,
  agreementLineCount: PropTypes.number,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default FormLines;
