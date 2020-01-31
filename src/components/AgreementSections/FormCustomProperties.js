import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import { FormTerms } from '@folio/stripes-erm-components';

class FormCustomProperties extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.supplementaryProperties" />}
        open={open}
        onToggle={onToggle}
      >
        <FormTerms
          data={this.props.data}
          optionalSectionLabel={<FormattedMessage id="ui-agreements.customProperties.optionalProperties" />}
          primarySectionLabel={<FormattedMessage id="ui-agreements.customProperties.primaryProperties" />}
        />
      </Accordion>
    );
  }
}

export default FormCustomProperties;
