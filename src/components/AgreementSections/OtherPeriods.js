import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Badge, Accordion, MultiColumnList } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import FormattedUTCDate from '../FormattedUTCDate';

export default class Lines extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      periods: PropTypes.arrayOf(PropTypes.shape({
        cancellationDeadline: PropTypes.string,
        endDate: PropTypes.string,
        note: PropTypes.string,
        startDate: PropTypes.string,
      })),
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  }

  columnMapping = {
    startDate: <FormattedMessage id="ui-agreements.agreements.startDate" />,
    endDate: <FormattedMessage id="ui-agreements.agreements.endDate" />,
    cancellationDeadline: <FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />,
    note: <FormattedMessage id="ui-agreements.note" />,
  }

  formatter = {
    startDate: p => (p.startDate ? <FormattedUTCDate value={p.startDate} /> : '-'),
    endDate: p => (p.endDate ? <FormattedUTCDate value={p.endDate} /> : '-'),
    cancellationDeadline: p => (p.cancellationDeadline ? <FormattedUTCDate value={p.cancellationDeadline} /> : '-'),
    note: p => p.note || '',
  }

  visibleColumns = [
    'startDate',
    'endDate',
    'cancellationDeadline',
    'note',
  ]

  renderBadge = () => {
    const count = get(this.props, 'agreement.periods.length');
    if (count === undefined) return <Spinner />;

    return <Badge data-test-agreement-periods-count={count}>{count}</Badge>;
  }

  render() {
    const {
      agreement,
      id,
      onToggle,
      open,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreementPeriods.otherPeriods" />}
        onToggle={onToggle}
        open={open}
      >
        <MultiColumnList
          columnMapping={this.columnMapping}
          contentData={agreement.periods}
          formatter={this.formatter}
          id="agreement-periods-list"
          interactive={false}
          visibleColumns={this.visibleColumns}
        />
      </Accordion>
    );
  }
}
