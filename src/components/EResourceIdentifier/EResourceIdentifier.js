import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  KeyValue,
  List
} from '@folio/stripes/components';

import { getResourceIdentifier } from '@folio/stripes-erm-components';
import css from '../styles.css';

const EResourceIdentifier = (
  { type, titleInstance, width = 3 }
) => {
  // added a 3rd parameter to 'getResourceIdentifier' to return an array with all identifiers
  // of a namespace instead of the first one as a string.
  // Should be always 'true' in this component.
  // If it's not set or 'false' the original string value will be returned
  const identifier = getResourceIdentifier(titleInstance, type, true);

  if (identifier.length === 0) return null;

  return (
    <Col xs={width}>
      <KeyValue
        label={<FormattedMessage id={`ui-agreements.identifier.${type}`} />}
      >
        <List
          id="eresourceIdentifier"
          items={identifier}
          listClass={css.listStyleDefault}
        />
      </KeyValue>
    </Col>
  );
};

EResourceIdentifier.propTypes = {
  titleInstance: PropTypes.object,
  type: PropTypes.string,
  width: PropTypes.number
};

export default EResourceIdentifier;
