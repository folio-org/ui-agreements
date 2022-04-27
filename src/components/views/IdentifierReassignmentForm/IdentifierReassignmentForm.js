import React, { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { CalloutContext } from '@folio/stripes/core';

import {
  Button,
  Modal,
  ModalFooter,
  Icon,
  Row,
  Col,
  Headline,
} from '@folio/stripes/components';

import SourceTitleIdentifierField from './SourceTitleIdentifierField';
import DestinationTitleIdentifierField from './DestinationTitleIdentifierField';

import SourceTitlePreview from './SourceTitlePreview/SourceTitlePreview';
import DestinationTitlePreview from './DestinationTitlePreview/DestinationTitlePreview';

const propTypes = {
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,

  eresourceName: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

const IdentifierReassignmentForm = ({
    open,
    onClose,
    eresourceName,
  }) => {
  const [submitValue, setSubmitValue] = useState('');
  const [previewModal, setPreviewModal] = useState(false);

  const submitHandler = (value) => {
    console.log('submited value: %o:', value);
  };

  const callout = useContext(CalloutContext);
  const saveTitleCallout = useCallback(() => {
    callout.sendCallout({
      type: 'success',
      message: (
        <FormattedMessage id="ui-agreements.titleUpdated-callout" values={{ eresourceName }} />)
    });
  }, [eresourceName, callout]);

  return (
    <Form onSubmit={submitHandler}>
      {({ handleSubmit, form:{ restart }, values }) => {
        console.log("FORM VALUES: %o", values)

        const closeAndClearForm = e => {
          onClose(e);
          restart();
        };

        return (
          <form
            onSubmit={handleSubmit}
          >
            <Modal
              dismissible
              footer={(
                <ModalFooter>
                  {/* We change the behaviour of these buttons depending on if we're on the form screen or the preview screen */}
                  <Button
                    buttonStyle="primary mega"
                    disabled={!values?.destinationTitle}
                    id={`clickable-${!previewModal ? 'submit' : 'preview'}`}
                    onClick={previewModal ? (() => handleSubmit() && saveTitleCallout()) : () => setPreviewModal(true)}
                  >
                    {previewModal ?
                      <FormattedMessage id="ui-agreements.updatetitlesAndClose" />
                      :
                      <FormattedMessage id="ui-agreements.preview" />
                    }
                  </Button>
{/*                   {previewModal ?
                    <div style={{ float: 'right' }}>
                      <Button
                        buttonStyle="default mega"
                        id="clickable-preview-and-update"
                        onClick={saveTitleCallout}
                      >
                        <FormattedMessage id="ui-agreements.updatetitlesAndMoveMore" />
                      </Button>
                    </div>
                  :
                  null
                  } */}
                  <Button
                    buttonStyle="default mega"
                    id={`clickable-${previewModal ? 'back' : 'cancel'}`}
                    marginBottom0
                    onClick={previewModal ? () => setPreviewModal(false) : closeAndClearForm}
                  >
                    {previewModal ?
                      <FormattedMessage id="ui-agreements.back" />
                      :
                      <FormattedMessage id="stripes-components.cancel" />
                    }
                  </Button>
                </ModalFooter>
                )}
              id="move-identifiers-modal"
              label={previewModal ?
                <FormattedMessage id="ui-agreements.preview" />
                :
                <FormattedMessage id="ui-agreements.eresource.moveIdentifier" />}
              onClose={closeAndClearForm}
              open={open}
              size="large"
            >
              {previewModal ?
                <>
                  <FormattedMessage id="ui-agreements.preview.updateAndContinue" />
                  <Row>
                    <Col md={5.5} xs={12}>
                      <h2>
                        <FormattedMessage id="ui-agreements.eresource.sourceTitle" />
                      </h2>
                      <SourceTitlePreview />
                    </Col>
                    <Icon icon="caret-right" />
                    <Col md={5.5} xs={12}>
                      <h2>
                        <FormattedMessage id="ui-agreements.eresource.destinationTitle" />
                      </h2>
                      <DestinationTitlePreview />
                    </Col>
                  </Row>
                </>
                :
                <>
                  <Row>
                    <Col md={5.5} xs={12}>
                      <h2>
                        <FormattedMessage id="ui-agreements.eresource.sourceTitle" />
                      </h2>
                      <SourceTitleIdentifierField
                        formRestart={restart}
                        previewModal={previewModal}
                      />
                    </Col>
                    <Icon icon="caret-right" />
                    <Col md={5.5} xs={12}>
                      <h2>
                        <FormattedMessage id="ui-agreements.eresource.destinationTitle" />
                      </h2>
                      <DestinationTitleIdentifierField
                        formRestart={restart}
                        previewModal={previewModal}
                      />
                    </Col>
                  </Row>
                </>
              }
            </Modal>
          </form>
        );
      }}
    </Form>
  );
};

IdentifierReassignmentForm.propTypes = propTypes;
export default IdentifierReassignmentForm;
