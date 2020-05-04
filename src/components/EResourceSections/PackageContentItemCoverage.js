import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Accordion,
  Badge,
  FormattedUTCDate,
  KeyValue,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import Embargo from '../Embargo';

export default class PackageContentItemCoverage extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    pci: PropTypes.shape({
      embargo: PropTypes.shape({
        movingWallStart: PropTypes.shape({
          length: PropTypes.number,
          unit: PropTypes.string
        }),
        movingWallEnd: PropTypes.shape({
          length: PropTypes.number,
          unit: PropTypes.string
        })
      }),
    })
  }

  columnMapping = {
    startDate: <FormattedMessage id="ui-agreements.pci.coverage.startDate" />,
    startVolume: <FormattedMessage id="ui-agreements.pci.coverage.startVolume" />,
    startIssue: <FormattedMessage id="ui-agreements.pci.coverage.startIssue" />,
    endDate: <FormattedMessage id="ui-agreements.pci.coverage.endDate" />,
    endVolume: <FormattedMessage id="ui-agreements.pci.coverage.endVolume" />,
    endIssue: <FormattedMessage id="ui-agreements.pci.coverage.endIssue" />,
  }

  formatter = {
    startDate: coverage => <div data-test-start-date>{this.renderDate(coverage.startDate)}</div>,
    startVolume: coverage => <div data-test-start-volume>{coverage?.startVolume ?? <NoValue />}</div>,
    startIssue: coverage => <div data-test-start-issue>{coverage?.startIssue ?? <NoValue />}</div>,
    endDate: coverage => <div data-test-end-date>{this.renderDate(coverage?.endDate)}</div>,
    endVolume: coverage => <div data-test-end-volume>{coverage?.endVolume ?? <NoValue />}</div>,
    endIssue: coverage => <div data-test-end-issue>{coverage?.endIssue ?? <NoValue />}</div>,
  }

  visibleColumns = [
    'startDate',
    'startVolume',
    'startIssue',
    'endDate',
    'endVolume',
    'endIssue',
  ];

  renderBadge = () => {
    const count = this.props?.pci?.coverage?.length ?? 0;
    return <Badge>{count}</Badge>;
  }

  renderCoverage = (pci) => (
    <MultiColumnList
      columnMapping={this.columnMapping}
      contentData={pci.coverage}
      formatter={this.formatter}
      id="pci-coverage"
      interactive={false}
      isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.pciCoverage" />}
      visibleColumns={this.visibleColumns}
    />
  );

  renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : <NoValue />
  );

  renderEmbargo = (pci) => {
    return pci.embargo ? (
      <KeyValue label={<FormattedMessage id="ui-agreements.embargo" />}>
        <Embargo embargo={pci?.embargo} />
      </KeyValue>
    ) : null;
  }

  render() {
    const { id, onToggle, open, pci = {} } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.eresources.coverage" />}
        onToggle={onToggle}
        open={open}
      >
        {this.renderEmbargo(pci)}
        {this.renderCoverage(pci)}
      </Accordion>
    );
  }
}
