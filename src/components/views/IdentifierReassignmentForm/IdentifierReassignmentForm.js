import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';

import {
  Button,
  Modal,
  ModalFooter,
  Icon,
} from '@folio/stripes/components';

import SourceTitleIdentifierField from './SourceTitleIdentifierField';
import DestinationTitleIdentifierField from './DestinationTitleIdentifierField';
import PreviewForm from './PreviewForm';

const propTypes = {
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  values: PropTypes.object,
  sourceTitelSelected: PropTypes.func,
};

const IdentifierReassignmentForm = ({
    open,
    onClose,
    values,
    sourceTitelSelected,
  }) => {
  // const [selectedTI, setSelctedTI] = useState({});
  const [previewModal, setPreviewModal] = useState(false);
  const [previewButton, setPreviewButton] = useState(false);

  // useEffect(() => {
  //   console.log(' identifier selected ');
  // }, [selectedTI]);

  // const handleSetSourceTI = () => {
  //   setSelctedTI();
  // };

useEffect(() => {
  setPreviewButton(previewButton);
}, [previewButton]);

  const handleSubmit = (value) => {
    console.log(values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ form:{ restart } }) => {
        return (
          <form
            onSubmit={handleSubmit}
          >
            <Modal
              dismissible
              footer={(
                <ModalFooter>
                  <Button
                    buttonStyle="primary mega"
                    disabled={previewButton}
                    id="clickable-preview"
                    onClick={setPreviewButton(true)}
                  >
                    <FormattedMessage id="ui-agreements.preview" />
                  </Button>
                  <Button
                    buttonStyle="default mega"
                    id="clickable-cancel"
                    marginBottom0
                    onClick={onClose}
                  >
                    <FormattedMessage id="stripes-components.cancel" />
                  </Button>
                </ModalFooter>
                )}
              id="move-identifiers-modal"
              label={<FormattedMessage id="ui-agreements.eresource.moveIdentifier" />}
              onClose={onClose}
              open={open}
              size="large"
            >
              <SourceTitleIdentifierField formRestart={restart} preview={previewButton} />
              <Icon icon="caret-down" />
              <DestinationTitleIdentifierField formRestart={restart} />
            </Modal>
            <PreviewForm
              onClose={() => setPreviewModal(false)}
              open={previewModal}
            />
          </form>
        );
      }}
    </Form>
  );
};

IdentifierReassignmentForm.propTypes = propTypes;
export default IdentifierReassignmentForm;
