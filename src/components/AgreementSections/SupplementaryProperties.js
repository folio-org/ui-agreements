import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CustomPropertiesList } from '@folio/stripes-erm-components';
import { Accordion } from '@folio/stripes/components';

export default class SupplementaryProperties extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    data: PropTypes.shape({ supplementaryProperties: PropTypes.array }),
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }

  render() {
    const {
      agreement,
      data: { supplementaryProperties },
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
          customProperties={supplementaryProperties}
          resource={agreement}
        />
      </Accordion>
    );
  }
}
