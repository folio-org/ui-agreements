import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Button,
  ButtonGroup,
  FormattedUTCDate,
  Icon,
  Layout,
  MultiColumnList,
  NoValue,
  Spinner,
  Tooltip,
} from '@folio/stripes/components';

import { Coverage } from '../Coverage';
import EResourceLink from '../EResourceLink';
import { resultCount } from '../../constants';

export default class PackageContents extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      packageContents: PropTypes.array,
      packageContentsCount: PropTypes.number,
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
  };

  formatter = {
    name: pci => <EResourceLink eresource={pci.pti.titleInstance} />,
    platform: pci => {
      return (
        <div>
          <div>{pci?.pti?.platform?.name ?? <NoValue />}</div>
          <div>{this.renderPtiUrl(pci)}</div>
        </div>
      );
    },
    coverage: pci => <Coverage pci={pci} />,
    accessStart: pci => this.renderDate(pci.accessStart),
    accessEnd: pci => this.renderDate(pci.accessEnd),
  };

  visibleColumns = ['name', 'platform', 'coverage', 'accessStart', 'accessEnd'];

  renderList = (packageContents, packageContentsCount) => {
    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        contentData={packageContents}
        formatter={this.formatter}
        id="package-contents-list"
        interactive={false}
        maxHeight={800}
        onNeedMoreData={this.props.onNeedMorePackageContents}
        pageAmount={resultCount.RESULT_COUNT_INCREMENT}
        pagingType="click"
        totalCount={packageContentsCount}
        virtualize
        visibleColumns={this.visibleColumns}
      />
    );
  };

  renderDate = date => (date ? <FormattedUTCDate value={date} /> : '-');

  renderBadge = () => {
    const count = this.props.data?.packageContentsCount;
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  };

  renderFilterButton = filter => (
    <Button
      buttonStyle={
        this.props.data.packageContentsFilter === filter ? 'primary' : 'default'
      }
      id={`clickable-pci-${filter}`}
      onClick={() => this.props.onFilterPackageContents(filter)}
    >
      <FormattedMessage id={`ui-agreements.content.${filter}`} />
    </Button>
  );

  renderFilterButtons = () => (
    <Layout className="textCentered">
      <ButtonGroup>
        {this.renderFilterButton('current')}
        {this.renderFilterButton('future')}
        {this.renderFilterButton('dropped')}
        {this.renderFilterButton('all')}
      </ButtonGroup>
    </Layout>
  );

  renderPtiUrl = (pci) => {
    const url = pci?.pti?.url;
    return url ? (
      <Tooltip
        key={pci.id}
        id={`tooltip-${pci.id}`}
        placement="bottom"
        text={<FormattedMessage
          id="ui-agreements.eresources.accessTitleOnPlatform"
          values={{
            name: pci?.pti?.name
          }}
        />}
      >
        {({ ref, ariaIds }) => (
          <div
            ref={ref}
            aria-labelledby={ariaIds.text}
          >
            <a
              href={url}
              onClick={e => e.stopPropagation()}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FormattedMessage id="ui-agreements.eresources.titleOnPlatform" />
              &nbsp;
              <Icon icon="external-link" />
            </a>
          </div>
        )}
      </Tooltip>
    ) : <NoValue />;
  }

  render() {
    const {
      data: { packageContents, packageContentsCount },
      id,
      onToggle,
      open,
    } = this.props;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={
          <FormattedMessage id="ui-agreements.eresources.packageResources" />
        }
        onToggle={onToggle}
        open={open}
      >
        {this.renderFilterButtons()}
        {packageContents ? (
          this.renderList(packageContents, packageContentsCount)
        ) : (
          <Spinner />
        )}
      </Accordion>
    );
  }
}
