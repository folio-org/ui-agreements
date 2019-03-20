import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, Icon, Layout, MultiColumnList } from '@folio/stripes/components';

import CoverageStatements from '../../../CoverageStatements';
import CustomCoverageIcon from '../../../CustomCoverageIcon';
import EResourceLink from '../../../EResourceLink';

export default class EresourcesCovered extends React.Component {
  static propTypes = {
    fetchMoreEresources: PropTypes.func.isRequired,
    parentResources: PropTypes.shape({
      agreementEresources: PropTypes.object,
    }),
    visible: PropTypes.bool,
  };

  state = {
    open: true,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
    package: <FormattedMessage id="ui-agreements.eresources.package" />,
    haveAccess: <FormattedMessage id="ui-agreements.eresources.haveAccess" />,
    accessStart: <FormattedMessage id="ui-agreements.eresources.accessStart" />,
    accessEnd: <FormattedMessage id="ui-agreements.eresources.accessEnd" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
  }

  columnWidths = {
    name: 250,
    platform: 150,
    package: 150,
    coverage: 225,
    isCustomCoverage: 25,
  }

  formatter = {
    name: e => {
      const titleInstance = get(e._object, ['pti', 'titleInstance'], {});
      return <EResourceLink eresource={titleInstance} />;
    },
    platform: e => get(e._object, ['pti', 'platform', 'name'], '-'),
    package: e => get(e._object, ['pkg', 'name'], '-'),
    haveAccess: () => 'TBD',
    accessStart: () => 'TBD',
    accessEnd: () => 'TBD',
    coverage: e => <CoverageStatements isCustomCoverage={e.customCoverage} statements={e.coverage} />,
    isCustomCoverage: e => (e.customCoverage ? <CustomCoverageIcon /> : null),
  }

  visibleColumns = [
    'name',
    'platform',
    'package',
    'haveAccess',
    'accessStart',
    'accessEnd',
    'coverage',
    'isCustomCoverage'
  ]

  onToggleAccordion = () => {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  renderCustomCoverage = () => {
    return (
      <Layout
        className="flex"
        data-test-custom-coverage
      >
        <Icon icon="clock" status="success" />
      </Layout>
    );
  }

  renderBadge = () => {
    const count = get(this.props.parentResources, ['agreementEresources', 'records', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  render() {
    const agreementEresources = get(this.props.parentResources, ['agreementEresources', 'records'], []);

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id="eresources-covered"
        label={<FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />}
        open={this.state.open}
        onToggle={this.onToggleAccordion}
      >
        <MultiColumnList
          columnMapping={this.columnMapping}
          columnWidths={this.columnWidths}
          contentData={this.props.visible && this.state.open ? agreementEresources : []}
          formatter={this.formatter}
          height={800}
          id="eresources-covered"
          interactive={false}
          onNeedMoreData={this.props.fetchMoreEresources}
          virtualize
          visibleColumns={this.visibleColumns}
        />
      </Accordion>
    );
  }
}
