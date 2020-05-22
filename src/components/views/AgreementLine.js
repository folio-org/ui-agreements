import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  LoadingPane,
  Pane,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission } from '@folio/stripes/core';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import { Info, POLines, Coverage } from '../AgreementLineSections';
import { urls } from '../utilities';

const propTypes = {
  data: PropTypes.shape({
    line: PropTypes.shape({
      coverage: PropTypes.array,
      customCoverage: PropTypes.bool,
      endDate: PropTypes.string,
      id: PropTypes.string,
      note: PropTypes.string,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      poLines: PropTypes.PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        titleOrPackage: PropTypes.string,
        poLineNumber: PropTypes.string,
      })),
      startDate: PropTypes.string,
    }).isRequired,
  }),
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
};

const AgreementLine = ({
  data: { line },
  handlers,
  isLoading,
}) => {
  const paneProps = {
    defaultWidth: '55%',
    dismissible: true,
    id: 'pane-view-agreement-line',
    onClose: handlers.onClose,
  };

  if (isLoading) return <LoadingPane data-loading {...paneProps} />;

  return (
    <Pane
      actionMenu={() => (
        <IfPermission perm="ui-agreements.agreements.edit">
          <Button
            buttonStyle="dropdownItem"
            id="clickable-dropdown-edit-agreement-line"
            onClick={handlers.onEdit}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-agreements.agreements.edit" />
            </Icon>
          </Button>
          <Button
            buttonStyle="dropdownItem"
            id="clickable-dropdown-delete-agreement-line"
            onClick={handlers.onDelete}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-agreements.delete" />
            </Icon>
          </Button>
        </IfPermission>
      )}
      appIcon={<AppIcon app="agreements" />}
      paneTitle={<FormattedMessage id="ui-agreements.agreementLine" />}
      {...paneProps}
    >
      <Info line={line} />
      <AccordionStatus>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton id="clickable-expand-all" />
          </Col>
        </Row>
        <AccordionSet>
          <POLines line={line} />
          <Coverage line={line} />
          <FormattedMessage id="ui-agreements.line.lineForAgreement" values={{ agreementName: line.owner?.name }}>
            {title => (
              <NotesSmartAccordion
                domainName="agreements"
                entityId={line.id ?? '-'}
                entityName={title ?? '-'}
                entityType="agreementLine"
                id="agreement-line-notes"
                pathToNoteCreate={urls.noteCreate()}
                pathToNoteDetails={urls.notes()}
              />
            )}
          </FormattedMessage>
        </AccordionSet>
      </AccordionStatus>
    </Pane>
  );
};

AgreementLine.propTypes = propTypes;
export default AgreementLine;
