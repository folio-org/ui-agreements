import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  HasCommand,
  Headline,
  Row,
} from '@folio/stripes/components';

import {
  Agreements,
  PCICoverage,
  PCIInfo,
} from '../EResourceSections';

import PackageCard from '../PackageCard';
import TitleCard from '../TitleCard';

export default class PCI extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      entitlements: PropTypes.arrayOf(PropTypes.object),
      eresource: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        pkg: PropTypes.object,
        status: PropTypes.shape({
          label: PropTypes.string,
        }),
      }).isRequired,
      relatedEntitlements: PropTypes.arrayOf(PropTypes.object),
      searchString: PropTypes.string,
      settings: PropTypes.object,
    }),
    handlers: PropTypes.shape({
      isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    }),
    history: PropTypes.object,
    match: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();
  }

  getInitialAccordionsState = () => {
    return {
      'pci-coverage': false,
      'eresourceAgreements': false,
    };
  }

  expandAllSections = (e) => {
    e.preventDefault();
    const { state, setStatus } = this.accordionStatusRef.current;
    // eslint-disable-next-line no-undef
    setStatus(() => _.mapValues(state, () => true));
  }

  collapseAllSections = (e) => {
    e.preventDefault();
    const { state, setStatus } = this.accordionStatusRef.current;
    // eslint-disable-next-line no-undef
    setStatus(() => _.mapValues(state, () => false));
  }

  goToEdit = () => {
    const { history, match: { params } } = this.props;
    history.push(`/erm/eresources/${params.id}/edit`);
  };

  render() {
    const { data, handlers: { isSuppressFromDiscoveryEnabled } } = this.props;
    const { eresource, searchString } = data;

    const shortcuts = [
      {
        name: 'edit',
        handler: this.goToEdit,
      },
      {
        name: 'expandAllSections',
        handler: this.expandAllSections,
      },
      {
        name: 'collapseAllSections',
        handler: this.collapseAllSections
      }
    ];

    return (
      <HasCommand
        commands={shortcuts}
        isWithinScope
        scope={document.body}
      >
        <div id="eresource-pci">
          <PCIInfo isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled} pci={eresource} />
          <div data-test-parent-package-details>
            <Headline margin="small" size="large" tag="h3">
              <FormattedMessage id="ui-agreements.eresources.parentPackageDetails" />
            </Headline>
            <PackageCard pkg={eresource?.pkg ?? {}} searchString={searchString} />
          </div>
          <div id="title-info">
            <Headline margin="small" size="large" tag="h3">
              <FormattedMessage id="ui-agreements.eresources.titleDetails" />
            </Headline>
            <TitleCard searchString={searchString} title={data.eresource} />
          </div>
          <AccordionStatus ref={this.accordionStatusRef}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton />
              </Col>
            </Row>
            <AccordionSet initialStatus={this.getInitialAccordionsState()}>
              <PCICoverage data={data} />
              <Agreements
                data={data}
                headline={eresource.name}
                id="eresourceAgreements"
                renderRelatedEntitlements
                visibleColumns={['name', 'type', 'startDate', 'endDate']}
              />
            </AccordionSet>
          </AccordionStatus>
        </div>
      </HasCommand>
    );
  }
}
