import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CustomPropertiesList } from '@folio/stripes-erm-components';
import { Accordion, Badge } from '@folio/stripes/components';

export default class SupplementaryProperties extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    data: PropTypes.shape({ supplementaryProperties: PropTypes.arrayOf(PropTypes.object) }),
  }

  renderBadge = () => {
    console.log("supplementaryProperties %o", this.props.data.supplementaryProperties)
    console.log("agreement %o", this.props.agreement.customProperties)
    const count = 5;
    console.log("count %o", count)
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
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
