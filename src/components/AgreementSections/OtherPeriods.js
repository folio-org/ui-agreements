import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Badge, Accordion, MultiColumnList } from '@folio/stripes/components';

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
    startDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodStart" />,
    endDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodEnd" />,
    cancellationDeadline: <FormattedMessage id="ui-agreements.agreements.cancellationDeadline" />,
    note: <FormattedMessage id="ui-agreements.agreementPeriods.periodNote" />,
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

  render() {
    const {
      agreement,
      agreement: { currentPeriod },
      id,
      onToggle,
      open,
    } = this.props;

    const otherPeriods = (agreement.periods || [])
      .filter(period => period.id !== (currentPeriod && currentPeriod.id));

    return (
      <Accordion
        displayWhenClosed={<Badge>{otherPeriods.length}</Badge>}
        displayWhenOpen={<Badge>{otherPeriods.length}</Badge>}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreementPeriods.otherPeriods" />}
        onToggle={onToggle}
        open={open}
      >
        <MultiColumnList
          columnMapping={this.columnMapping}
          contentData={otherPeriods}
          formatter={this.formatter}
          id="agreement-periods-list"
          interactive={false}
          visibleColumns={this.visibleColumns}
        />
      </Accordion>
    );
  }
}
