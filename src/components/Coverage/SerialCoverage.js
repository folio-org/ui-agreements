import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FormattedUTCDate, Icon, Layout } from '@folio/stripes/components';

export default class SerialCoverage extends React.Component {
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
        { date ? <div data-test-date={date}><FormattedUTCDate value={date} /></div> : null }
        <div
          data-test-issue={issue}
          data-test-volume={volume}
        >
          {this.renderVolume(volume)}
          {volume && issue ? <React.Fragment>&nbsp;</React.Fragment> : null}
          {this.renderIssue(issue)}
        </div>
      </React.Fragment>
    );
  }

  renderStatement = (statement, i) => {
    const {
      startDate,
      startVolume,
      startIssue,
      endDate,
      endVolume,
      endIssue,
    } = statement;

    if (!startDate && !startVolume && !startIssue && !endDate && !endVolume && !endIssue) {
      return '';
    }

    return (
      <Layout
        className="flex justified"
        data-test-statement={i}
        key={i}
      >
        <Layout
          className="margin-end-gutter textRight"
          data-test-start
          style={{ width: '40%' }}
        >
          {this.renderDate(startDate, startVolume, startIssue)}
        </Layout>
        <Icon icon="arrow-right" />
        <Layout
          className="margin-start-gutter"
          data-test-end
          style={{ width: '40%' }}
        >
          {this.renderDate(endDate, endVolume, endIssue)}
        </Layout>
      </Layout>
    );
  }

  render() {
    const { statements } = this.props;
    if (!statements || !statements.length) return '-';

    return <Layout className="full" data-test-coverage-statements>{statements.map(this.renderStatement)}</Layout>;
  }
}
