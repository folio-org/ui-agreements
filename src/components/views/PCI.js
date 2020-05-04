import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  Headline,
  LoadingPane,
  Row,
} from '@folio/stripes/components';

import {
  Agreements,
  PCICoverage,
  PCIInfo,
  ParentPackageDetails,
  TitleInfo,
} from '../EResourceSections';

export default class PCI extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        status: PropTypes.shape({
          label: PropTypes.string,
        }),
      }).isRequired,
      relatedEntitlements: PropTypes.array,
    }),
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    isLoading: PropTypes.bool,
  }

  getSectionProps = (id) => {
    const { data } = this.props;

    return {
      data,
      id,
      pci: data.eresource,
    };
  }

  render() {
    const {
      data: { eresource },
      handlers,
      isLoading,
    } = this.props;

    const paneProps = {
      defaultWidth: '45%',
      dismissible: true,
      id: 'pane-view-pci',
      onClose: handlers.onClose,
    };

    if (isLoading) return <LoadingPane data-loading {...paneProps} />;

    const initial = {
      'coverage': true,
      'pci-agreements': true
    };

    return (
      <div id="eresource-pci">
        <PCIInfo pci={eresource} />
        <div data-test-parent-package-details>
          <Headline margin="small" size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.parentPackageDetails" />
          </Headline>
          <ParentPackageDetails pkg={eresource?.pkg ?? {}} />
        </div>
        <div id="title-info">
          <Headline margin="small" size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.titleDetails" />
          </Headline>
          <TitleInfo data={this.props.data} />
        </div>
        <AccordionStatus initialStatus={initial}>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <PCICoverage {...this.getSectionProps('coverage')} />
            <Agreements
              {...this.getSectionProps('pci-agreements')}
              headline={eresource.name}
              renderRelatedEntitlements
              visibleColumns={['name', 'type', 'startDate', 'endDate']}
            />
          </AccordionSet>
        </AccordionStatus>
      </div>
    );
  }
}
