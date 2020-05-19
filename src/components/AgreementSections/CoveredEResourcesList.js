import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  ButtonGroup,
  Callout,
  Col,
  Dropdown,
  DropdownMenu,
  FormattedUTCDate,
  Headline,
  Icon,
  Layout,
  MultiColumnList,
  NoValue,
  Row,
  Spinner,
  Tooltip,
} from '@folio/stripes/components';

import { getResourceIdentifier } from '../utilities';
import { Coverage } from '../Coverage';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import IfEResourcesEnabled from '../IfEResourcesEnabled';

export default class CoveredEResourcesList extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      eresources: PropTypes.arrayOf(PropTypes.object),
      eresourcesCount: PropTypes.number,
      lines: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    eresourcesFilterPath: PropTypes.string,
    onFilterEResources: PropTypes.func.isRequired,
    onExportEResourcesAsJSON: PropTypes.func.isRequired,
    onExportEResourcesAsKBART: PropTypes.func.isRequired,
    onNeedMoreEResources: PropTypes.func.isRequired,
    visible: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.callout = React.createRef();
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    issn: <FormattedMessage id="ui-agreements.identifier.issn" />,
    platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
    package: <FormattedMessage id="ui-agreements.eresources.package" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
    accessStart: <FormattedMessage id="ui-agreements.eresources.accessStart" />,
    accessEnd: <FormattedMessage id="ui-agreements.eresources.accessEnd" />,
  }

  columnWidths = {
    name: 250,
    platform: 150,
    package: 150,
    coverage: 250,
  }

  formatter = {
    name: e => {
      const titleInstance = get(e._object, 'pti.titleInstance', {});
      return <EResourceLink eresource={titleInstance} />;
    },
    issn: e => {
      const titleInstance = get(e._object, 'pti.titleInstance', {});
      return getResourceIdentifier(titleInstance, 'eissn') || getResourceIdentifier(titleInstance, 'pissn');
    },
    platform: e => {
      return (
        <div>
          <div>{e?._object?.pti?.platform?.name ?? <NoValue />}</div>
          <div>{this.renderPtiUrl(e)}</div>
        </div>
      );
    },
    package: e => get(e._object, 'pkg.name', '-'),
    coverage:  e => <Coverage eResource={e} />,
    accessStart: e => this.renderDate(e._object?.accessStart),
    accessEnd: e => this.renderDate(e._object?.accessEnd),
    isCustomCoverage: line => {
      if (!line.customCoverage) return '';
      return (
        <Tooltip
          id={`covered-eresources-cc-tooltip-${line.rowIndex}`}
          text={<FormattedMessage id="ui-agreements.customcoverages.tooltip" />}
        >
          {({ ref, ariaIds }) => <CustomCoverageIcon ref={ref} aria-labelledby={ariaIds.text} />
          }
        </Tooltip>
      );
    },
  }

  visibleColumns = [
    'name',
    'issn',
    'platform',
    'package',
    'coverage',
    'isCustomCoverage',
    'accessStart',
    'accessEnd',
  ]

  export = (exportCallback) => {
    const calloutId = this.callout.current.sendCallout({
      message: <FormattedMessage id="ui-agreements.eresourcesCovered.preparingExport" />,
      timeout: 0,
    });

    exportCallback().then(() => this.callout.current.removeCallout(calloutId));
  }

  renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : ''
  )

  renderExportDropdown = (disabled) => (
    <Dropdown
      buttonProps={{
        'data-test-export-button': true,
        'disabled': disabled,
        'marginBottom0': true,
      }}
      label={<FormattedMessage id="ui-agreements.eresourcesCovered.exportAs" />}
    >
      <DropdownMenu role="menu">
        <FormattedMessage id="ui-agreements.eresourcesCovered.exportAsJSON">
          {exportAsJson => (
            <Button
              aria-label={exportAsJson}
              buttonStyle="dropdownItem"
              id="clickable-dropdown-export-eresources-json"
              onClick={() => this.export(this.props.onExportEResourcesAsJSON)}
              role="menuitem"
            >
              <FormattedMessage id="ui-agreements.eresourcesCovered.json" />
            </Button>
          )}
        </FormattedMessage>
        <FormattedMessage id="ui-agreements.eresourcesCovered.exportAsJSON">
          {exportAsKbart => (
            <Button
              aria-label={exportAsKbart}
              buttonStyle="dropdownItem"
              id="clickable-dropdown-export-eresources-kbart"
              onClick={() => this.export(this.props.onExportEResourcesAsKBART)}
              role="menuitem"
            >
              <FormattedMessage id="ui-agreements.eresourcesCovered.kbart" />
            </Button>
          )}
        </FormattedMessage>
      </DropdownMenu>
    </Dropdown>
  )

  renderFilterButton = (filter) => (
    <Button
      buttonStyle={this.props.eresourcesFilterPath === filter ? 'primary' : 'default'}
      id={`clickable-pci-${filter}`}
      marginBottom0
      onClick={() => this.props.onFilterEResources(filter)}
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

  renderList = () => {
    const {
      agreement: { eresources, eresourcesCount },
      onNeedMoreEResources,
      visible,
    } = this.props;
    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={visible ? eresources : []}
        formatter={this.formatter}
        id="eresources-covered"
        interactive={false}
        maxHeight={800}
        onNeedMoreData={onNeedMoreEResources}
        totalCount={eresourcesCount}
        virtualize
        visibleColumns={this.visibleColumns}
      />
    );
  }

  renderPtiUrl = (eresource) => {
    const url = eresource?._object?.pti?.url;
    return url ? (
      <Tooltip
        key={eresource.id}
        id={`tooltip-${eresource.id}`}
        placement="bottom"
        text={<FormattedMessage
          id="ui-agreements.eresources.accessTitleOnPlatform"
          values={{
            name: eresource?._object?.pti?.name
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
    const { agreement: { eresources, lines }, eresourcesFilterPath } = this.props;
    const exportDisabled = eresourcesFilterPath === 'dropped' || eresourcesFilterPath === 'future';

    return lines?.length ? (
      <IfEResourcesEnabled>
        <Layout className="marginTop1">
          <Headline margin="small" tag="h4">
            <FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />
          </Headline>
        </Layout>
        <Row end="xs">
          <Col md={9} xs={12}>
            {this.renderFilterButtons()}
          </Col>
          <Col md={3} xs={12}>
            {this.renderExportDropdown(exportDisabled)}
            {exportDisabled ?
              <Tooltip
                id="covered-eresources-export-tooltip"
                placement="top"
                text={<FormattedMessage id="ui-agreements.eresourcesCovered.exportButton.tooltip" />}
              >
                {({ ref, ariaIds }) => (
                  <Icon
                    ref={ref}
                    aria-labelledby={ariaIds.text}
                    icon="exclamation-circle"
                    tabIndex="0"
                  />
                )}
              </Tooltip> :
              ''
            }
          </Col>
        </Row>
        {eresources ? this.renderList() : <Spinner />}
        <Callout ref={this.callout} />
      </IfEResourcesEnabled>
    ) : null;
  }
}
