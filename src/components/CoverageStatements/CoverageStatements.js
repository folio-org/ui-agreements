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

  renderVolume = (volume) => {
    if (!volume) return null;

    return (
      <React.Fragment>
        <FormattedMessage id="ui-agreements.coverage.volumeShort" />
        {volume}
      </React.Fragment>
    );
  }

  renderIssue = (issue) => {
    if (!issue) return null;

    return (
      <React.Fragment>
        <FormattedMessage id="ui-agreements.coverage.issueShort" />
        {issue}
      </React.Fragment>
    );
  }

  renderDate = (date, volume, issue) => {
    if (!date && !volume && !issue) return '*';

    return (
      <React.Fragment>
        { date ? <div>{date}</div> : null }
        <div>
          {this.renderVolume(volume)}
          &nbsp;
          {this.renderIssue(issue)}
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
        <Icon icon="arrow-right" />
        <Layout className="margin-start-gutter">
          {this.renderDate(statement.endDate, statement.endVolume, statement.endIssue)}
        </Layout>
      </Layout>
    );
  }

  render() {
    const { statements } = this.props;
    if (!statements || !statements.length) return '-';

    return <div>{statements.map(this.renderStatement)}</div>;
  }
}
