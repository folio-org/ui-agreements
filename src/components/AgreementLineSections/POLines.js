import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
} from '@folio/stripes/components';
import POLineCard from '../POLineCard';

const propTypes = {
  line: PropTypes.shape({
    poLines: PropTypes.PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      titleOrPackage: PropTypes.string,
      poLineNumber: PropTypes.string,
    })),
  }).isRequired,
};

const POLines = ({
  line: { poLines = [] },
}) => {
  return (
    <Accordion
      id="agreement-line-po-lines"
      label={<FormattedMessage id="ui-agreements.poLines.poLines" />}
    >
      {poLines.length ?
        poLines.map(poLine => (
          <POLineCard
            key={poLine.id}
            id={`ag-line-pol-card-${poLine.id}`}
            poLine={poLine}
          />
        ))
        :
        <FormattedMessage id="ui-agreements.polines.lineHasNone" />
      }
    </Accordion>
  );
};

POLines.propTypes = propTypes;
export default POLines;
