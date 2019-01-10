import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, Icon } from '@folio/stripes/components';

import EresourceAgreementLines from './EresourceAgreementLines';
import EresourcesCovered from './EresourcesCovered';

export default class Eresources extends React.Component {
  static propTypes = {
    fetchMoreEresources: PropTypes.func,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderBadge = () => {
    const count = get(this.props.agreementLines, ['length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.eresourceAgreementLines" />}
        open={open}
        onToggle={onToggle}
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
      >
        <EresourceAgreementLines
          visible={open}
          {...this.props}
        />
        <EresourcesCovered
          visible={open}
          {...this.props}
        />
      </Accordion>
    );
  }
}
