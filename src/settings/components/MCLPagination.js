import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  MultiColumnList,
  Layout
} from '@folio/stripes/components';

const MCLPagination = ({ name, dataOptions }) => {
  const visibleColumns = [
    'name',
    'initialLoad',
    'pageSize',
  ];

  /*  const formatter = {
    name: line => {
    }
  }; */

  return (
    <>
      <Layout className="padding-bottom-gutter padding-top-gutter" data-test-mcl-pagination-description>
        <strong>
          <FormattedMessage id="ui-agreements.settings.general.mclPagination.description" />
        </strong>
      </Layout>
      <MultiColumnList
        // columnMapping={this.columnMapping}
        contentData={dataOptions}
        // formatter={this.formatter}
        id="mcl-pagination"
        visibleColumns={visibleColumns}
      />
    </>
  );
};

MCLPagination.propTypes = {
  dataOptions: PropTypes.object,
  name: PropTypes.string
};

export default MCLPagination;

