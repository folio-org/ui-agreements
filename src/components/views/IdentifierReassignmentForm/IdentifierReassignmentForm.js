import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { useMutation } from 'react-query';
import { CalloutContext, useOkapiKy } from '@folio/stripes/core';

import {
  Button,
  Modal,
  ModalFooter,
  Icon,
  Row,
  Col,
  MessageBanner,
} from '@folio/stripes/components';

import css from '../../styles.css';
import SourceTitleIdentifierField from './SourceTitleIdentifierField';
import DestinationTitleIdentifierField from './DestinationTitleIdentifierField';

import SourceTitlePreview from './SourceTitlePreview/SourceTitlePreview';
import DestinationTitlePreview from './DestinationTitlePreview/DestinationTitlePreview';

const propTypes = {
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func,
  }),
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

const IdentifierReassignmentForm = ({
  open,
  onClose,
}) => {
  const callout = useContext(CalloutContext);
  const [previewModal, setPreviewModal] = useState(false);
  const [idJobCreated, setIdJobCreated] = useState();
  const [sourceTitleName, setSourceTitleName] = useState('');
  const [destinationTitleName, setDestinationTitleName] = useState('');

  const ky = useOkapiKy();

  const { mutateAsync: postSourceIdentifierJob } = useMutation(
    ['erm/jobs/identifierReassignment', 'ui-agreements', 'identifierReassignmentForm', 'postJob'],
    (payload) => ky.post('erm/jobs/identifierReassignment', { json: payload }).json().then(res => {
      callout.sendCallout({
        type: 'success',
        message: (
          <FormattedMessage id="ui-agreements.job.created.success.org.olf.general.jobs.IdentifierReassignmentJob" values={{ sourceTitleName }} />)
      });
      setIdJobCreated(res?.name);
    })
  );

  const { mutateAsync: postDestinationIdentifierJob } = useMutation(
    ['erm/jobs/identifierReassignment', 'ui-agreements', 'identifierReassignmentForm', 'postJob'],
    (payload) => ky.post('erm/jobs/identifierReassignment', { json: payload }).json().then(res => {
      callout.sendCallout({
        type: 'success',
        message: (
          <FormattedMessage id="ui-agreements.job.created.success.org.olf.general.jobs.destination" values={{ destinationTitleName }} />)
      });
      setIdJobCreated(res?.name);
    })
  );

  const submitHandler = (values) => {
    const identifierReassignmentArray = [];
    for (const [key, value] of Object.entries(values)) {
      if (
        key !== 'sourceTIObject' &&
        key !== 'destinationTIObject' &&
        key !== 'destinationTitle'
      ) {
        /* The remaining keys all correspond to potential moving identifiers and take the shape
            {
              issn: ['1234-5678'],
              ezb: ['325425325', 'undefined', '325325']
            },
           * We will construct an IdentifierReassignmentJob shape from them, see https://issues.folio.org/browse/ERM-1987
           */
        for (const [nsKey, idVals] of Object.entries(value)) {
          idVals.forEach(idVal => {
            if (idVal) {
              identifierReassignmentArray.push({
                initialTitleInstanceId: key,
                targetTitleInstanceId: values.destinationTitle,
                identifierNamespace: nsKey,
                identifierValue: idVal
              });
            }
          });
        }
      }
    }

    postSourceIdentifierJob({
      payload: identifierReassignmentArray
    });

    postDestinationIdentifierJob({
      payload: identifierReassignmentArray
    });
  };

  return (
    <Form onSubmit={submitHandler}>
      {({ handleSubmit, form:{ change, restart }, values }) => {
        const closeAndClearForm = e => {
          onClose(e);
          setPreviewModal(false);
          restart();
          setIdJobCreated();
        };

        const saveCloseAndClearForm = e => {
          handleSubmit();
          closeAndClearForm(e);
        };

        const saveAndReturnToMove = () => {
          handleSubmit();

          // Cache source/destination object
          const sourceTIObject = values.sourceTIObject;
          const destinationTIObject = values.destinationTIObject;
          // Restart and then reset the source/destination objects
          restart();
          change('sourceTIObject', sourceTIObject);
          change('destinationTIObject', destinationTIObject);
          setPreviewModal(false);
        };

        return (
          <form
            data-testid="identifierReassignmentForm"
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
                    onClick={previewModal ? (() => saveCloseAndClearForm()) : () => setPreviewModal(true)}
                  >
                    {previewModal ?
                      <FormattedMessage id="ui-agreements.updatetitlesAndClose" />
                      :
                      <FormattedMessage id="ui-agreements.preview" />
                    }
                  </Button>
                  {previewModal &&
                  <span className={css.moveMoreIdentifiers}>
                    <Button
                      buttonStyle="default mega"
                      id="clickable-save-and-move-more-identifiers"
                      marginBottom0
                      onClick={saveAndReturnToMove}
                    >
                      <FormattedMessage id="ui-agreements.updatetitlesAndMoveMore" />
                    </Button>
                  </span>
                  }
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
              {previewModal ? `identifiers ${'-'} and ${'-'} will be moved from ${sourceTitleName} to ${destinationTitleName}.` : null}<br />
              {idJobCreated &&
                <MessageBanner type="warning">
                  <FormattedMessage id="ui-agreements.updateMoreIdentifierWarning" values={{ name: idJobCreated }} />
                </MessageBanner>
              }
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
                        setTitleName={setSourceTitleName}
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
                        setTitleName={setDestinationTitleName}
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
