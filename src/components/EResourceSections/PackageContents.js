import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Button,
  ButtonGroup,
  FormattedUTCDate,
  Layout,
  MultiColumnList,
  Row,
  Spinner,
} from '@folio/stripes/components';

import CoverageStatements from '../CoverageStatements';
import EResourceLink from '../EResourceLink';
import { resultCount } from '../../constants';

export default class PackageContents extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      packageContents: PropTypes.array,
      packageContentsFilter: PropTypes.string,
    }),
    id: PropTypes.string,
    onFilterPackageContents: PropTypes.func.isRequired,
    onNeedMorePackageContents: PropTypes.func.isRequired,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    accessStart: <FormattedMessage id="ui-agreements.eresources.accessStart" />,
    accessEnd: <FormattedMessage id="ui-agreements.eresources.accessEnd" />,
  }

  renderEdition = (edition) => {
    if (!edition) return null;

    return (
      <React.Fragment>
        <FormattedMessage id="ui-agreements.coverage.editionShort" />
        {edition}
      </React.Fragment>
    );
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

  coverageFormatter = (pci) => {
    const titleInstance = get(pci, 'pti.titleInstance');

    // Date can take the forms yyyy, yyyy-mm or yyyy-mm-dd, and is stored as a string.
    const date = get(titleInstance, 'dateMonographPublished');
    const volume = get(titleInstance, 'monographVolume');
    const edition = get(titleInstance, 'monographEdition');

    if (get(titleInstance, 'type.value') === 'monograph') {
      if (!date && !volume && !edition) {
        return '*';
      } else {
        return (
          <React.Fragment>
            <Layout
              className="full"
              data-test-statement={titleInstance.name}
            >
              <Layout
                className="flex justified"
                data-test-statement={titleInstance.name}
              >
                <Layout
                  className="margin-end-gutter textRight"
                  data-test-start
                  style={{ width: '40%' }}
                >
                  { date ? <div data-test-date={date}><FormattedUTCDate value={date} /></div> : null }
                  <div
                    data-test-edition={edition}
                    data-test-volume={volume}
                  >
                    {this.renderEdition(edition)}
                    {volume && edition ? <React.Fragment>&nbsp;</React.Fragment> : null}
                    {this.renderVolume(volume)}
                  </div>
                </Layout>
                <Layout
                  className="margin-start-gutter"
                  data-test-start
                  style={{ width: '40%' }}
                />
              </Layout>
            </Layout>
          </React.Fragment>
        );
      }
    } else {
      return (
        <CoverageStatements statements={pci.coverage} />
      );
    }
  }

  formatter = {
    name: pci => <EResourceLink eresource={pci.pti.titleInstance} />,
    platform: pci => get(pci, 'pti.platform.name', ''),
    coverage: pci => this.coverageFormatter(pci),
    accessStart: pci => this.renderDate(pci.accessStart),
    accessEnd: pci => this.renderDate(pci.accessEnd),
  }

  visibleColumns = [
    'name',
    'platform',
    'coverage',
    'accessStart',
    'accessEnd',
  ]

  renderList = (packageContents, packageContentsCount) => {
    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        contentData={packageContents}
        formatter={this.formatter}
        id="package-contents-list"
        maxHeight={800}
        onNeedMoreData={this.props.onNeedMorePackageContents}
        pageAmount={resultCount.RESULT_COUNT_INCREMENT}
        pagingType="click"
        totalCount={packageContentsCount}
        virtualize
        visibleColumns={this.visibleColumns}
      />
    );
  }

  renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : '-'
  )

  renderBadge = () => {
    const count = get(this.props.data, 'packageContentsCount');
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  renderFilterButton = (filter) => (
    <Button
      buttonStyle={this.props.data.packageContentsFilter === filter ? 'primary' : 'default'}
      id={`clickable-pci-${filter}`}
      onClick={() => this.props.onFilterPackageContents(filter)}
    >
      <FormattedMessage id={`ui-agreements.content.${filter}`} />
    </Button>
  )

  renderFilterButtons = () => (
    <Layout className="textCentered">
      <ButtonGroup>
        {this.renderFilterButton('current')}
        {this.renderFilterButton('future')}
        {this.renderFilterButton('dropped')}
        {this.renderFilterButton('all')}
      </ButtonGroup>
    </Layout>
  )

  render() {
    const {
      data: { packageContents, packageContentsCount },
      id,
      onToggle,
      open
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.eresources.packageResources" />}
        onToggle={onToggle}
        open={open}
      >
        {this.renderFilterButtons()}
        {packageContents ? this.renderList(packageContents, packageContentsCount) : <Spinner />}
      </Accordion>
    );
  }
}
