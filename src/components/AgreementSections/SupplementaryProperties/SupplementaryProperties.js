import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CustomPropertiesList } from '@folio/stripes-erm-components';
import { Accordion, Badge, Spinner } from '@folio/stripes/components';

export default class SupplementaryProperties extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    data: PropTypes.object,
  }

  renderBadge = () => {
    const { agreement: { customProperties }, id } = this.props;
    if (customProperties !== undefined) {
      const count = id === 'openAccessProperties' ?
        Object.values(customProperties).filter(cp => cp[0]?.type?.ctx === 'OpenAccess').length
        :
        Object.values(customProperties).filter(cp => cp[0]?.type?.ctx !== 'OpenAccess').length;

      return <Badge>{count}</Badge>;
    } else {
      return <Spinner />;
    }
  }

  render() {
    const {
      agreement,
      data,
      id,
    } = this.props;

    const customPropertyData = id === 'supplementaryProperties' ? data.supplementaryProperties : data.openAccessProperties;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id={`ui-agreements.${id}`} />}
      >
        <CustomPropertiesList
          customProperties={customPropertyData}
          isEmptyMessage={<FormattedMessage id={`ui-agreements.emptyAccordion.${id}`} />}
          resource={agreement}
        />
      </Accordion>
    );
  }
}
