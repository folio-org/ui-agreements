import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
} from '@folio/stripes/components';
import POLineCard from '../POLineCard';

const propTypes = {
  line: PropTypes.shape({
    coverage: PropTypes.array,
    customCoverage: PropTypes.bool,
    endDate: PropTypes.string,
    id: PropTypes.string,
    note: PropTypes.string,
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    poLines: PropTypes.PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      titleOrPackage: PropTypes.string,
      poLineNumber: PropTypes.string,
    })),
    startDate: PropTypes.string,
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
