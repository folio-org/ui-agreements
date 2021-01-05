import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  HasCommand,
  Headline,
  KeyValue,
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
      checkScope: PropTypes.func.isRequired,
      collapseAllSections: PropTypes.func.isRequired,
      expandAllSections: PropTypes.func.isRequired,
      isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
      onEdit: PropTypes.func.isRequired,
      onNeedMoreEntitlements: PropTypes.func.isRequired,
    }),
  }

  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();
  }

  getInitialAccordionsState = () => {
    return {
      'pci-coverage': false,
      'eresourceAgreements': false,
      'discoverySettings': false
    };
  }

  render() {
    const { data, handlers } = this.props;
    const { eresource, searchString } = data;

    const shortcuts = [
      {
        name: 'edit',
        handler: handlers.onEdit,
      },
      {
        name: 'expandAllSections',
        handler: (e) => handlers.expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => handlers.collapseAllSections(e, this.accordionStatusRef)
      }
    ];

    return (
      <HasCommand
        commands={shortcuts}
        isWithinScope={handlers.checkScope}
        scope={document.body}
      >
        <div id="eresource-pci">
          <PCIInfo pci={eresource} />
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
                handlers={handlers}
                headline={eresource.name}
                id="eresourceAgreements"
                renderRelatedEntitlements
                visibleColumns={['name', 'type', 'startDate', 'endDate']}
              />
              {(handlers.isSuppressFromDiscoveryEnabled('pci') || handlers.isSuppressFromDiscoveryEnabled('title')) &&
                <Accordion
                  id="discoverySettings"
                  label={<FormattedMessage id="ui-agreements.eresources.discoverySettings" />}
                >
                  <Row>
                    {handlers.isSuppressFromDiscoveryEnabled('pci') &&
                      <Col xs={3}>
                        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.discoverySettings.suppressFromDiscoveryTitleInPackage" values={{ breakingLine: <br /> }} />}>
                          <div>
                            <FormattedMessage id={`ui-agreements.${eresource?.suppressFromDiscovery ? 'yes' : 'no'}`} />
                          </div>
                        </KeyValue>
                      </Col>
                    }
                    {handlers.isSuppressFromDiscoveryEnabled('title') &&
                      <Col xs={3}>
                        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.discoverySettings.suppressFromDiscoveryTitle" values={{ breakingLine: <br /> }} />}>
                          <div>
                            <FormattedMessage id={`ui-agreements.${eresource?.pti?.titleInstance?.suppressFromDiscovery ? 'yes' : 'no'}`} />
                          </div>
                        </KeyValue>
                      </Col>
                    }
                  </Row>
                </Accordion>
              }
            </AccordionSet>
          </AccordionStatus>
        </div>
      </HasCommand>
    );
  }
}
