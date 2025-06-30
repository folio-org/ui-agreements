import React, { useRef } from 'react';
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

const Package = ({ data, handlers }) => {
  const accordionStatusRef = useRef();

  const getSectionProps = (id) => ({
    eresource: data.eresource,
    data,
    id,
    handlers,
  });

  const initialAccordionsState = {
    eresourceAgreements: false,
    extendedPackageInformation: false,
    notes: false,
    packageContents: false,
  };

  const shortcuts = [
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  const { eresource: { alternateResourceNames, description, identifiers, packageDescriptionUrls } } = data;
  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <div id="eresource-package">
        <PackageInfo {...getSectionProps('info')} />
        <AccordionStatus ref={accordionStatusRef}>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet initialStatus={initialAccordionsState}>
            {(!!description || !!alternateResourceNames?.length || !!packageDescriptionUrls?.length || !!identifiers?.length) &&
              <ExtendedPackageInformation {...getSectionProps('extendedPackageInformation')} />
            }
            <Agreements
              {...getSectionProps('eresourceAgreements')}
              isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsPackage" />}
              visibleColumns={['name', 'type', 'startDate', 'endDate']}
            />
            <PackageContents
              {...getSectionProps('packageContents')}
              onFilterPackageContents={handlers.onFilterPackageContents}
            />
            <NotesSmartAccordion
              {...getSectionProps('notes')}
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
};

Package.propTypes = {
  data: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default Package;
