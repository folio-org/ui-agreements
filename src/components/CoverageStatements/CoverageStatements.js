import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Icon, Layout } from '@folio/stripes/components';

export default class CoverageStatements extends React.Component {
  static propTypes = {
    statements: PropTypes.arrayOf(
      PropTypes.shape({
        endDate: PropTypes.string,
        endIssue: PropTypes.string,
        endVolume: PropTypes.string,
        startDate: PropTypes.string,
        startIssue: PropTypes.string,
        startVolume: PropTypes.string,
      })
    ),
  }

  renderDate = (date, volume, issue) => {
    if (!date && !volume && !issue) return '*';

    return (
      <React.Fragment>
        <div>{date}</div>
        <div>
          <FormattedMessage id="ui-agreements.coverage.volumeShort" />
          {volume}
          &nbsp;
          <FormattedMessage id="ui-agreements.coverage.issueShort" />
          {issue}
        </div>
      </React.Fragment>
    );
  }

  renderStatement = (statement, i) => {
    return (
      <Layout key={i} className="flex">
        <Layout className="margin-end-gutter">
          {this.renderDate(statement.startDate, statement.startVolume, statement.startIssue)}
        </Layout>
        <Icon icon="right-arrow" />
        <Layout className="margin-start-gutter">
          {this.renderDate(statement.endDate, statement.endVolume, statement.endIssue)}
        </Layout>
      </Layout>
    );
  }

  render() {
    const { statements } = this.props;
    if (!statements || !statements.length) return '-';

    return (
      <React.Fragment>
        {statements.map(this.renderStatement)}
      </React.Fragment>
    );
  }
}
