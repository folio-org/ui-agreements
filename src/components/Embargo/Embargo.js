import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Layout } from '@folio/stripes/components';

export default class Embargo extends React.Component {
    static propTypes = {
      embargo: PropTypes.shape({
        movingWallStart: PropTypes.shape({
          length: PropTypes.number,
          unit: PropTypes.string
        }),
        movingWallEnd: PropTypes.shape({
          length: PropTypes.number,
          unit: PropTypes.string
        })
      })
    }

    renderEmbargoEnd(embargo) {
      if (embargo.movingWallEnd) {
        const unitId = `ui-agreements.${embargo.movingWallEnd.unit}`;
        const number = embargo.movingWallEnd.length;
        return (
          <Layout
            data-test-embargo-end
            data-test-embargo-end-length={number}
            data-test-embargo-end-unit={embargo.movingWallEnd.unit}
          >
            <FormattedMessage id="ui-agreements.embargo.end" />
            <FormattedMessage id={unitId} values={{ count: number }} />
          </Layout>
        );
      }
      return null;
    }

    renderEmbargoStart(embargo) {
      if (embargo.movingWallStart) {
        const unitId = `ui-agreements.${embargo.movingWallStart.unit}`;
        const number = embargo.movingWallStart.length;
        return (
          <Layout
            data-test-embargo-start
            data-test-embargo-start-length={number}
            data-test-embargo-start-unit={embargo.movingWallStart.unit}
          >
            <FormattedMessage id="ui-agreements.embargo.start" />
            <FormattedMessage id={unitId} values={{ count: number }} />
          </Layout>
        );
      }
      return null;
    }


    render() {
      const { embargo } = this.props;
      if (!embargo) return null;

      return (
        <Layout className="full" data-test-embargo>
          {this.renderEmbargoStart(embargo)}
          {this.renderEmbargoEnd(embargo)}
        </Layout>
      );
    }
}
