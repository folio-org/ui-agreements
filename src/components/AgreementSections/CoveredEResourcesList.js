import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  Headline,
  MultiColumnList,
  Row,
  Tooltip,
} from '@folio/stripes/components';

import CoverageStatements from '../CoverageStatements';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import IfEResourcesEnabled from '../IfEResourcesEnabled';


export default class CoveredEResourcesList extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      eresources: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
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
  }

  formatter = {
    name: e => {
      const titleInstance = get(e._object, 'pti.titleInstance', {});
      return <EResourceLink eresource={titleInstance} />;
    },
    platform: e => get(e._object, 'pti.platform.name', '-'),
    package: e => get(e._object, 'pkg.name', '-'),
    haveAccess: () => 'TBD',
    accessStart: () => 'TBD',
    accessEnd: () => 'TBD',
    coverage: e => <CoverageStatements statements={e.coverage} />,
    isCustomCoverage: line => {
      const customCoverageTooltipLabel = 'Custom Coverage';
      if (!line.customCoverage) return '';
      return (
        <div>
          <Tooltip
            text={customCoverageTooltipLabel}
            id="custom_coverage_tooltip"
          >
            {({ ref }) => <span ref={ref}>
              <CustomCoverageIcon/>
            </span>
            }
            
          </Tooltip>
        </div>
      );
    },
  }

  visibleColumns = [
    'name',
    'platform',
    'package',
    'coverage',
    'isCustomCoverage'
  ]

  handleToggleExportDropdown = () => {
    this.setState(prevState => ({ exportDropdownOpen: prevState.exportDropdownOpen }));
  }

  renderExportDropdown = () => (
    <Row end="xs">
      <Col xs>
        <Dropdown
          onToggle={() => this.setState(prevState => ({ exportDropdownOpen: !prevState.exportDropdownOpen }))}
          open={this.state.exportDropdownOpen}
        >
          <DropdownButton data-role="toggle">
            <FormattedMessage id="ui-agreements.eresourcesCovered.exportAs" />
          </DropdownButton>
          <DropdownMenu data-role="menu">
            <FormattedMessage id="ui-agreements.eresourcesCovered.exportAsJSON">
              {exportAsJson => (
                <Button
                  aria-label={exportAsJson}
                  buttonStyle="dropdownItem"
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
      </Col>
    </Row>
  )

  render() {
    const {
      agreement: { eresources, eresourcesCount },
      onNeedMoreEResources,
      visible,
    } = this.props;

    return (
      <IfEResourcesEnabled>
        <Headline margin="none" tag="h4">
          <FormattedMessage id="ui-agreements.agreements.eresourcesCovered" />
        </Headline>
        { this.renderExportDropdown() }
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
      </IfEResourcesEnabled>
    );
  }
}
