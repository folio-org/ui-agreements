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
} from '../EResourceSections';

import PackageCard from '../PackageCard';
import TitleCard from '../TitleCard';

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
          <PackageCard pkg={eresource?.pkg ?? {}} searchString={searchString} />
        </div>
        <div id="title-info">
          <Headline margin="small" size="large" tag="h3">
            <FormattedMessage id="ui-agreements.eresources.titleDetails" />
          </Headline>
          <TitleCard searchString={searchString} title={data.eresource} />
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
