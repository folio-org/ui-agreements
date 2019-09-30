import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Badge, Accordion } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import CoveredEResourcesList from './CoveredEResourcesList';
import LinesList from './LinesList';


export default class Lines extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      eresources: PropTypes.arrayOf(PropTypes.object),
      lines: PropTypes.arrayOf(PropTypes.object),
      orderLines: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    handlers: PropTypes.shape({
      onClickFilterButton: PropTypes.func.isRequired,
      onExportEResourcesAsJSON: PropTypes.func.isRequired,
      onExportEResourcesAsKBART: PropTypes.func.isRequired,
      onNeedMoreEResources: PropTypes.func.isRequired,
      onNeedMoreLines: PropTypes.func.isRequired,
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }

  renderBadge = () => {
    const count = get(this.props, 'agreement.lines.length');
    if (count === undefined) return <Spinner />;

    return <Badge data-test-agreement-lines-count={count}>{count}</Badge>;
  }

  render() {
    const {
      agreement,
      handlers,
      id,
      onToggle,
      open,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementLines" />}
        onToggle={onToggle}
        open={open}
      >
        <LinesList
          agreement={agreement}
          onNeedMoreLines={handlers.onNeedMoreLines}
          visible={open}
        />
        <CoveredEResourcesList
          agreement={agreement}
          onClickFilterButton={handlers.onClickFilterButton}
          onExportEResourcesAsJSON={handlers.onExportEResourcesAsJSON}
          onExportEResourcesAsKBART={handlers.onExportEResourcesAsKBART}
          onNeedMoreEResources={handlers.onNeedMoreEResources}
          visible={open}
        />
      </Accordion>
    );
  }
}
