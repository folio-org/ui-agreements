import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CustomPropertiesList } from '@folio/stripes-erm-components';
import { Accordion, Badge, Spinner } from '@folio/stripes/components';

export default class SupplementaryProperties extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    data: PropTypes.shape({ supplementaryProperties: PropTypes.arrayOf(PropTypes.object) }),
  }

  renderBadge = () => {
    const { agreement: { customProperties } } = this.props;
    if (customProperties !== undefined) {
      const count = Object.keys(customProperties).length;
      return <Badge>{count}</Badge>;
    } else {
      return <Spinner />;
    }
  }

  render() {
    const {
      agreement,
      data: { supplementaryProperties },
      id,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.supplementaryProperties" />}
      >
        <CustomPropertiesList
          customProperties={supplementaryProperties}
          isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.supplementaryProperties" />}
          resource={agreement}
        />
      </Accordion>
    );
  }
}
