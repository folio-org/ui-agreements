import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, Icon } from '@folio/stripes/components';

import EresourceAgreementLines from './EresourceAgreementLines';
import EresourcesCovered from './EresourcesCovered';

export default class Eresources extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    fetchMoreEresources: PropTypes.func,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderBadge = () => {
    const count = get(this.props.agreementLines, ['length']);
    if (!count) return <Icon icon="spinner-ellipsis" width="10px" />;

    return <Badge data-test-agreement-lines-count={count}>{count}</Badge>;
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
        <div style={{ marginLeft: '2rem' }}>
          <EresourcesCovered
            visible={open}
            {...this.props}
          />
        </div>
      </Accordion>
    );
  }
}
