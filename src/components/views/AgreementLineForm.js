import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  Pane,
  PaneFooter,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import { FormInfo, FormPOLines, FormCoverage } from '../AgreementLineSections';
import { isExternal } from '../utilities';

const propTypes = {
  data: PropTypes.shape({
    line: PropTypes.shape({
      resource: PropTypes.shape({
        _object: PropTypes.object,
      }),
    }),
  }),
  form: PropTypes.shape({
    getRegisteredFields: PropTypes.func.isRequired,
  }).isRequired,
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

const AgreementLineForm = ({
  data: { line },
  form,
  handlers,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const hasLoaded = form.getRegisteredFields().length > 0;
  const resource = isExternal(line) ? line : (line.resource?._object ?? {});

  return (
    <Paneset>
      <Pane
        appIcon={<AppIcon app="agreements" />}
        centerContent
        defaultWidth="100%"
        dismissible
        footer={(
          <PaneFooter
            renderEnd={(
              <Button
                buttonStyle="primary mega"
                disabled={pristine || submitting}
                id="clickable-update-agreement-line"
                marginBottom0
                onClick={handleSubmit}
                type="submit"
              >
                <FormattedMessage id="stripes-components.saveAndClose" />
              </Button>
            )}
            renderStart={(
              <Button
                buttonStyle="default mega"
                id="clickable-cancel"
                marginBottom0
                onClick={handlers.onClose}
              >
                <FormattedMessage id="stripes-components.cancel" />
              </Button>
            )}
          />
        )}
        id="pane-agreement-line-form"
        onClose={handlers.onClose}
        paneTitle={<FormattedMessage id="ui-agreements.line.edit" />}
      >
        {hasLoaded ? <div id="form-loaded" /> : null}
        <AccordionStatus>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton id="clickable-expand-all" />
            </Col>
          </Row>
          <AccordionSet>
            <FormInfo line={line} resource={resource} />
            <FormPOLines line={line} resource={resource} />
            <FormCoverage line={line} resource={resource} />
          </AccordionSet>
        </AccordionStatus>
      </Pane>
    </Paneset>
  );
};

AgreementLineForm.propTypes = propTypes;

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
})(AgreementLineForm);
