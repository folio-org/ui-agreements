import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  ExpandAllButton,
  Headline,
  KeyValue,
  LoadingPane,
  NoValue,
  Pane
} from '@folio/stripes/components';
import { AppIcon, IfPermission } from '@folio/stripes/core';

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
  }).isRequired,
  isLoading: PropTypes.bool,
};

const AgreementLine = ({
  data,
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
      appIcon={<AppIcon app="agreements" />}
      lastMenu={(
        <Button
          buttonStyle="primary"
          marginBottom0
        >
          Edit
        </Button>
      )}
      paneTitle="Agreement line"
      {...paneProps}
    >
      <Headline size="x-large" tag="h2">
        Agreement line information
      </Headline>
      <KeyValue label="Parent agreement">
        <div data-test-agreement-line-agreement>
          {data.line.owner?.name ?? <NoValue />}
        </div>
      </KeyValue>
      <AccordionStatus>
        <ExpandAllButton id="clickable-expand-all" />
        <AccordionSet>
          <Accordion id="agreement-line-po-lines" label="PO lines">
            Here be the PO lines
          </Accordion>
          <Accordion id="agreement-line-coverage" label="Coverage">
            Here be the coverages and embargoes
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </Pane>
  );
};

AgreementLine.propTypes = propTypes;
export default AgreementLine;
