import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';

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
    const { id, onToggle, open } = this.props;
    const { eResourcesCoveredOpen } = this.state;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.eresourceAgreementLines" />}
        open={open}
        onToggle={onToggle}
      >
        <EresourceAgreementLines
          visible={open}
          {...this.props}
        />
        <Accordion
          id="eresources-covered"
          label={<FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />}
          open={eResourcesCoveredOpen}
          onToggle={this.onToggleEresourcesCovered}
        >
          <EresourcesCovered
            visible={open && eResourcesCoveredOpen}
            {...this.props}
          />
        </Accordion>
      </Accordion>
    );
  }
}
