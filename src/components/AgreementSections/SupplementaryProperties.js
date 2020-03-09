import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CustomPropertiesList } from '@folio/stripes-erm-components';
import { Accordion, Layout } from '@folio/stripes/components';

export default class SupplementaryProperties extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    data: PropTypes.shape({ supplementaryProperties: PropTypes.array }),
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }

  renderNosupplementaryProperties = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.emptyAccordion.supplementaryProperties" />
    </Layout>
  );

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
        {
          supplementaryProperties?.length ?
            <CustomPropertiesList
              customProperties={supplementaryProperties}
              resource={agreement}
            /> : this.renderNosupplementaryProperties()
        }

      </Accordion>
    );
  }
}
