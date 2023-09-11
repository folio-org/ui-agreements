import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  HasCommand,
  Row,
  checkScope,
  collapseAllSections,
  expandAllSections
} from '@folio/stripes/components';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  Agreements,
  ExtendedPackageInformation,
  PackageContents,
  PackageInfo,
} from '../../EResourceSections';

import { urls } from '../../utilities';
import { ERESOURCE_ENTITY_TYPE } from '../../../constants';

export default class Package extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    handlers: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();
  }

  getSectionProps = (id) => {
    const { data, handlers } = this.props;

    return {
      eresource: data.eresource,
      data,
      id,
      handlers,
    };
  }

  getInitialAccordionsState = () => {
    return {
      eresourceAgreements: false,
      extendedPackageInformation: false,
      notes: false,
      packageContents: false,
    };
  }

  render() {
    const { data, handlers } = this.props;
    const { data: { eresource: { alternateResourceNames, description, identifiers, packageDescriptionUrls } } } = this.props;

    /* istanbul ignore next */
    const shortcuts = [
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef)
      }
    ];

    return (
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <div id="eresource-package">
          <PackageInfo {...this.getSectionProps('info')} />
          <AccordionStatus ref={this.accordionStatusRef}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton />
              </Col>
            </Row>
            <AccordionSet initialStatus={this.getInitialAccordionsState()}>
              {(description || !!alternateResourceNames?.length || !!packageDescriptionUrls?.length || !!identifiers?.length) &&
                <ExtendedPackageInformation {...this.getSectionProps('extendedPackageInformation')} />
              }
              <Agreements
                {...this.getSectionProps('eresourceAgreements')}
                isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsPackage" />}
                visibleColumns={['name', 'type', 'startDate', 'endDate']}
              />
              <PackageContents
                {...this.getSectionProps('packageContents')}
                onFilterPackageContents={handlers.onFilterPackageContents}
                onNeedMorePackageContents={handlers.onNeedMorePackageContents}
              />
              <NotesSmartAccordion
                {...this.getSectionProps('notes')}
                domainName="agreements"
                entityId={data.eresource.id}
                entityName={data.eresource.name}
                entityType={ERESOURCE_ENTITY_TYPE}
                pathToNoteCreate={urls.noteCreate()}
                pathToNoteDetails={urls.notes()}
              />
            </AccordionSet>
          </AccordionStatus>
        </div>
      </HasCommand>
    );
  }
}
