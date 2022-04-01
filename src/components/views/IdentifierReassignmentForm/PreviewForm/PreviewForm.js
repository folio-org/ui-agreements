import React, { useState, useContext, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { Form } from 'react-final-form';
import { CalloutContext } from '@folio/stripes/core';

import {
  Button,
  Modal,
  ModalFooter
} from '@folio/stripes/components';

import SourceTitleIdentifierField from '../SourceTitleIdentifierField';

const propTypes = {
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  eresourceName: PropTypes.string,
};

const PreviewForm = ({ open, onClose, eresourceName }) => {
  const handleSubmit = (value) => {
    console.log(value);
  };

  const callout = useContext(CalloutContext);
  const onSaveTitle = useCallback(() => {
    callout.sendCallout({
      type: 'success',
      message: (
        <FormattedMessage id="ui-agreements.titleUpdated-callout" values={{ eresourceName }} />)
    });
  }, [eresourceName, callout]);

  return (
    <Form onSubmit={handleSubmit}>
      {({ form:{ restart } }) => {
        return (

          <form onSubmit={handleSubmit}>
            <Modal
              dismissible
              footer={(
                <ModalFooter>
                  <Button
                    buttonStyle="primary"
                    id="clickable-preview-and-close"
                    onClick={onSaveTitle}
                  >
                    <FormattedMessage id="ui-agreements.updateTitelsAndClose" />
                  </Button>
                  <Button
                    buttonStyle="default"
                    id="clickable-preview-and-update"
                    onClick={onSaveTitle}
                  >
                    <FormattedMessage id="ui-agreements.updateTitelsAndMoveMore" />
                  </Button>
                  <Button
                    buttonStyle="default"
                    id="clickable-cancel"
                    marginBottom0
                    onClick={onClose}
                  >
                    <FormattedMessage id="stripes-components.cancel" />
                  </Button>
                </ModalFooter>
              )}
              id="move-identifiers-modal"
              label={<FormattedMessage id="ui-agreements.preview" />}
              onClose={onClose}
              open={open}
              size="large"
            >
              {`identifiers ${''}: ${''}(${''}) and ${''}: ${''}(${''}) will be moved from ${''} to ${''}, ${''}: ${''}.`}
              <FormattedMessage id="ui-agreements.preview.updateAndContinue" />
              {/* <SourceTitleIdentifierField /> */}
            </Modal>
          </form>
        );
      }}
    </Form>
  );
};

PreviewForm.propTypes = propTypes;
export default PreviewForm;
