import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CustomPropertiesList } from '@folio/stripes-erm-components';
import { Accordion } from '@folio/stripes/components';

export default class AgreementTerms extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({ customProperties: PropTypes.object }),
    id: PropTypes.string,
    data: PropTypes.shape({ terms: PropTypes.object }),
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }

  render() {
    const {
      agreement,
      data: { terms },
      id,
      onToggle,
      open,
    } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.supplementaryProperties" />}
        open={open}
        onToggle={onToggle}
      >
        <CustomPropertiesList
          customProperties={terms}
          resource={agreement}
        />
      </Accordion>
    );
  }
}
