import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

import withKiwtFieldArray from '../../../withKiwtFieldArray';

class CustomCoverageFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    resource: PropTypes.object,
  }

  static defaultProps = {
    items: [],
  }

  renderLines = () => {
    return 'Custom Coverage List';
  }

  render = () => {
    return (
      <div>
        <div id="agreement-form-custom-coverages">
          { this.renderCustomCoverages() }
        </div>
        <Button id="add-agreement-custom-coverage-button" onClick={this.onAddField}>
          <FormattedMessage id="ui-agreements.agreementLines.addCustomCoverage" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(CustomCoverageFieldArray);
