import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
} from '@folio/stripes/components';

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

const Coverage = ({
  line,
}) => {
  return (
    <Accordion
      id="agreement-line-coverage"
      label={<FormattedMessage id="ui-agreements.eresources.coverage" />}
    >
      Here be the coverages and embargoes
    </Accordion>
  );
};

Coverage.propTypes = propTypes;
export default Coverage;
