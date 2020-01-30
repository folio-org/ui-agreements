import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CustomPropertiesList } from '@folio/stripes-erm-components';
import { Accordion } from '@folio/stripes/components';

export default class AgreementTerms extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    agreement: PropTypes.shape({ customProperties: PropTypes.object }),
    data: PropTypes.shape({ terms: PropTypes.object }),
  }

  render() {
    const {
      id,
      onToggle,
      open,
      agreement,
      data: { terms }
    } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.supplementaryInfo.supplementaryProperties" />}
        open={open}
        onToggle={onToggle}
      >
        <CustomPropertiesList
          resource={agreement}
          customProperties={terms}
        />
      </Accordion>
    );
  }
}
