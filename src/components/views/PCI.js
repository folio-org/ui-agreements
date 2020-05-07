import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  Headline,
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
      searchString: PropTypes.string,
    }),
  }

  render() {
    const { data } = this.props;
    const { eresource, searchString } = data;

    return (
      <div id="eresource-pci">
        <PCIInfo pci={eresource} />
        <div data-test-parent-package-details>
          <Headline margin="small" size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.parentPackageDetails" />
          </Headline>
          <ParentPackageDetails pkg={eresource?.pkg ?? {}} searchString={searchString} />
        </div>
        <div id="title-info">
          <Headline margin="small" size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.titleDetails" />
          </Headline>
          <TitleInfo data={data} />
        </div>
        <AccordionStatus>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <PCICoverage data={data} />
            <Agreements
              data={data}
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
