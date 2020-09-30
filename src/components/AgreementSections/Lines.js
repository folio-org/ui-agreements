import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Button, Accordion, Badge, Spinner } from '@folio/stripes/components';

import CoveredEResourcesList from './CoveredEResourcesList';
import LinesList from './LinesList';
import { urls } from '../utilities';

export default class Lines extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      eresources: PropTypes.arrayOf(PropTypes.object),
      id: PropTypes.string,
      lines: PropTypes.arrayOf(PropTypes.object),
      orderLines: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    eresourcesFilterPath: PropTypes.string,
    handlers: PropTypes.shape({
      onExportEResourcesAsJSON: PropTypes.func.isRequired,
      onExportEResourcesAsKBART: PropTypes.func.isRequired,
      onFilterEResources: PropTypes.func.isRequired,
      onNeedMoreEResources: PropTypes.func.isRequired,
      onNeedMoreLines: PropTypes.func.isRequired,
      onViewAgreementLine: PropTypes.func.isRequired,
    }).isRequired,
    id: PropTypes.string,
  }

  renderAddAgreementLineButton = () => {
    return (
      <Button id="add-agreement-line-button" to={urls.agreementLineCreate(this.props.agreement.id)}>
        <FormattedMessage id="ui-agreements.agreementLines.addLine" />
      </Button>
    );
  }

  renderBadge = () => {
    const count = get(this.props, 'agreement.lines.length');
    if (count === undefined) return <Spinner />;

    return <Badge data-test-agreement-lines-count={count}>{count}</Badge>;
  }

  render() {
    const {
      agreement,
      eresourcesFilterPath,
      handlers,
      id,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderAddAgreementLineButton()}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementLines" />}
      >
        <LinesList
          agreement={agreement}
          onNeedMoreLines={handlers.onNeedMoreLines}
          onViewAgreementLine={handlers.onViewAgreementLine}
        />
        <CoveredEResourcesList
          agreement={agreement}
          eresourcesFilterPath={eresourcesFilterPath}
          onExportEResourcesAsJSON={handlers.onExportEResourcesAsJSON}
          onExportEResourcesAsKBART={handlers.onExportEResourcesAsKBART}
          onFilterEResources={handlers.onFilterEResources}
          onNeedMoreEResources={handlers.onNeedMoreEResources}
        />
      </Accordion>
    );
  }
}
