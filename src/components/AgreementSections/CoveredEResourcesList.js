import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  Headline,
  Icon,
  Layout,
  MultiColumnList,
  Row,
  Tooltip,
} from '@folio/stripes/components';

import { Spinner } from '@folio/stripes-erm-components';
import { getResourceIdentifier } from '../utilities';
import CoverageStatements from '../CoverageStatements';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import FormattedUTCDate from '../FormattedUTCDate';
import IfEResourcesEnabled from '../IfEResourcesEnabled';

export default class CoveredEResourcesList extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      eresources: PropTypes.arrayOf(PropTypes.object),
      eresourcesCount: PropTypes.number,
    }).isRequired,
    eresourcesFilterPath: PropTypes.string,
    onFilterEResources: PropTypes.func.isRequired,
    onExportEResourcesAsJSON: PropTypes.func.isRequired,
    onExportEResourcesAsKBART: PropTypes.func.isRequired,
    onNeedMoreEResources: PropTypes.func.isRequired,
    visible: PropTypes.bool,
  };

  state = {
    exportDropdownOpen: false,
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
    platform: e => get(e._object, 'pti.platform.name', '-'),
    package: e => get(e._object, 'pkg.name', '-'),
    coverage: e => <CoverageStatements statements={e.coverage} />,
    accessStart: e => this.renderDate(get(e._object, 'accessStart')),
    accessEnd: e => this.renderDate(get(e._object, 'accessEnd')),
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

  handleToggleExportDropdown = () => {
    this.setState(prevState => ({ exportDropdownOpen: prevState.exportDropdownOpen }));
  }

  renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : '-'
  )

  renderExportDropdown = (disabled) => (
    <Dropdown
      onToggle={() => this.setState(prevState => ({ exportDropdownOpen: !prevState.exportDropdownOpen }))}
      open={this.state.exportDropdownOpen}
      disabled={disabled}
    >
      <DropdownButton
        data-test-export-button
        data-role="toggle"
        marginBottom0
      >
        <FormattedMessage id="ui-agreements.eresourcesCovered.exportAs" />
      </DropdownButton>
      <DropdownMenu data-role="menu">
        <FormattedMessage id="ui-agreements.eresourcesCovered.exportAsJSON">
          {exportAsJson => (
            <Button
              aria-label={exportAsJson}
              buttonStyle="dropdownItem"
              disabled={disabled}
              id="clickable-dropdown-export-eresources-json"
              onClick={() => {
                this.setState({ exportDropdownOpen: false });
                this.props.onExportEResourcesAsJSON();
              }}
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
              disabled={disabled}
              id="clickable-dropdown-export-eresources-kbart"
              onClick={() => {
                this.setState({ exportDropdownOpen: false });
                this.props.onExportEResourcesAsKBART();
              }}
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
      id={`clickable-pci-${filter || 'all'}`}
      marginBottom0
      onClick={() => this.props.onFilterEResources(filter)}
    >
      <FormattedMessage id={`ui-agreements.content.${filter || 'all'}`} />
    </Button>
  )

  renderFilterButtons = () => (
    <Layout className="textCentered">
      <ButtonGroup>
        {this.renderFilterButton('current')}
        {this.renderFilterButton('future')}
        {this.renderFilterButton('dropped')}
        {this.renderFilterButton('')}
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

  render() {
    const { agreement: { eresources }, eresourcesFilterPath } = this.props;
    const exportDisabled = eresourcesFilterPath === 'dropped' || eresourcesFilterPath === 'future';

    return (
      <IfEResourcesEnabled>
        <Headline margin="none" tag="h4">
          <FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />
        </Headline>
        <Row end="xs">
          <Col xs={12} md={9}>
            {this.renderFilterButtons()}
          </Col>
          <Col xs={12} md={3}>
            {this.renderExportDropdown(exportDisabled)}
            {exportDisabled ?
              <Tooltip
                id="covered-eresources-export-tooltip"
                placement="top"
                text={<FormattedMessage id="ui-agreements.eresourcesCovered.exportButton.tooltip" />}
              >
                {({ ref, ariaIds }) => (
                  <Icon
                    aria-labelledby={ariaIds.text}
                    icon="exclamation-circle"
                    ref={ref}
                    tabIndex="0"
                  />
                )}
              </Tooltip> :
              ''
            }
          </Col>
        </Row>
        {eresources ? this.renderList() : <Spinner />}
      </IfEResourcesEnabled>
    );
  }
}
