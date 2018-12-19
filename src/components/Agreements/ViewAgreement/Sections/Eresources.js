import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, Row } from '@folio/stripes/components';

import EresourceAgreementLines from './EresourceAgreementLines';
import EresourcesCovered from './EresourcesCovered';

export default class Eresources extends React.Component {
  static propTypes = {
    fetchMoreEresources: PropTypes.func,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  state = {
    eResourcesCoveredOpen: true,
  }

  onToggleEresourcesCovered = () => {
    this.setState((prevState) => ({
      eResourcesCoveredOpen: !prevState.eResourcesCoveredOpen,
    }));
  }

  render() {
    // The rendering of agreement lines and covered eresources can be fairly expensive.
    // To do so, they may be using virtualized rendering or other techniques which require
    // them to calculate how many lines/resources to show based on the DOM node heights.
    // When the accordions are hidden, the heights will be 0 and throw off the calculations,
    // so we're being safe and extra performant by not rendering those components here when
    // it's not necessary.

    const { id, onToggle, open } = this.props;
    const { eResourcesCoveredOpen } = this.state;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.eresourceAgreementLines" />}
        open={open}
        onToggle={onToggle}
      >
        { open ? <EresourceAgreementLines {...this.props} /> : <div /> }
        <Accordion
          id="eresources-covered"
          label={<FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />}
          open={eResourcesCoveredOpen}
          onToggle={this.onToggleEresourcesCovered}
        >
          {open && eResourcesCoveredOpen ? <EresourcesCovered {...this.props} /> : <div /> }
        </Accordion>
      </Accordion>
    );
  }
}
