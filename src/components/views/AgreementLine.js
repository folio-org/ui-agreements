import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  LoadingPane,
  Pane,
  Row,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { Info, POLines, Coverage } from '../AgreementLineSections';

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
      appIcon={<AppIcon app="agreements" />}
      lastMenu={(
        <Button
          buttonStyle="primary"
          marginBottom0
        >
          <FormattedMessage id="ui-agreements.agreements.edit" />
        </Button>
      )}
      paneTitle="Agreement line"
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
        </AccordionSet>
      </AccordionStatus>
    </Pane>
  );
};

AgreementLine.propTypes = propTypes;
export default AgreementLine;
