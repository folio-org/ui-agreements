import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState, useForm } from 'react-final-form';

import {
  RadioButton,
  RadioButtonGroup,
  Tooltip,
  Button,
  Card,
  Layout,
  KeyValue,
  Row,
  Col,
  Headline,
} from '@folio/stripes/components';

import { AppIcon, Pluggable } from '@folio/stripes/core';
import PreviewForm from '../PreviewForm';


const propTypes = {
  formRestart: PropTypes.func.isRequired
};

const DestinationTitleIdentifierField = ({ formRestart }) => {
  let triggerButton = useRef(null);

  const { initialValues, values } = useFormState();
  const initialDestinationTI = initialValues?.destinationTI?.ti._object;
  const [destinationTI, setDestinationTI] = useState(initialDestinationTI ?? {});
  const { change } = useForm();

  useEffect(() => {
    if (initialDestinationTI) {
      setDestinationTI(initialDestinationTI);
    }
  }, [initialDestinationTI]);


  const renderEmptyDestination = () => (
    <div>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-agreements.eresource.moveIdentifier.noDestinationTitle" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.eresource.destinationTitleSelectionText" />
      </Layout>
    </div>
  );

  const renderHeadLine = () => (
    <Headline size="large" tag="h3">
      <FormattedMessage id="ui-agreements.identifiers.identifierDestination" />
    </Headline>
  );

  const renderSourceTitleLinkButton = (value) => (
    <>
      <Field
        name="destinationTitleInstance"
        render={() => {
          const handleSetDestinationTI = (ti) => {
            setDestinationTI(ti._object);
            change('destinationTitleInstance', ti.id);
            formRestart();
          };

          return (
            <Pluggable
              dataKey="destinationIdentifierLookup"
              onEresourceSelected={handleSetDestinationTI}
              renderTrigger={(pluggableRenderProps) => {
                triggerButton = pluggableRenderProps.buttonRef;
                const eresourceName = destinationTI?.name;
                const buttonProps = {
                  'aria-haspopup': 'true',
                  'buttonRef': triggerButton,
                  'buttonStyle': value ? 'default' : 'primary',
                  'id': 'destinationIdentifierLookup-find-eresource-btn',
                  'marginBottom0': true,
                  'onClick': pluggableRenderProps.onClick
                };

                if (value) {
                  return (
                    <Tooltip
                      id="destinationIdentifierLookup-title-button-tooltip"
                      text={<FormattedMessage id="ui-agreements.moveIdentifiers.replaceTitleSpecific" values={{ eresourceName }} />}
                      triggerRef={triggerButton}
                    >
                      {({ ariaIds }) => (
                        <Button
                          aria-labelledby={ariaIds.text}
                          {...buttonProps}
                        >
                          <FormattedMessage id="ui-agreements.moveIdentifiers.replaceTitle" />
                        </Button>
                      )}
                    </Tooltip>
                  );
                }

                return (
                  <Button
                    {...buttonProps}
                  >
                    <FormattedMessage id="ui-agreements.moveIdentifiers.selectTitle" />
                  </Button>
                );
              }}
              type="find-eresource"
            >
              <FormattedMessage id="ui-agreements.moveIdentifiers.noPlugin" />
            </Pluggable>
          );
        }}
      />

    </>
  );

  const renderIdentifierField = () => {
    const validIdentifiers = destinationTI?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');
    // const identifier = getResourceIdentifier(titleInstance, type);
    return (
      validIdentifiers?.map((vi, index) => {
        return (
          <>
            <RadioButtonGroup>
              <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
                <Col xs={12}>
                  <RadioButton
                    key={index}
                    label={destinationTI?.subType?.label}
                    name="electronicIdentifiers"
                    value={vi?.identifier?.value}
                  />
                </Col>
                <Col
                  initialValue={vi?.identifier?.ns?.value}
                  label={vi?.identifier?.ns?.value}
                  name="electronicIdentifiers"
                />
              </KeyValue>
              <KeyValue label={vi?.identifier?.ns?.value}>
                {vi?.identifier?.value}
              </KeyValue>
            </RadioButtonGroup>
          </>
        );
      })
    );
  };

  const renderRelatedIdentifierField = () => {
    const validIdentifiers = destinationTI?.relatedTitles?.filter(tiId => tiId?.subType?.value === 'approved');
    return (
      validIdentifiers?.map((vi, index) => {
        return (
          <>
            <RadioButtonGroup>
              <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
                <Col xs={12}>
                  <RadioButton
                    key={index}
                    label={destinationTI?.relatedTitles?.subType?.label}
                    name="electronicIdentifiers"
                    value={vi?.identifier?.value}
                  />
                </Col>
                <Col
                  initialValue={vi?.identifier?.ns?.value}
                  label={vi?.identifier?.ns?.value}
                  name="electronicIdentifiers"
                />
              </KeyValue>
              <KeyValue label={vi?.identifier?.ns?.value}>
                {vi?.identifier?.value}
              </KeyValue>
            </RadioButtonGroup>
          </>
        );
      })
    );
  };

    // console.log('Formvalues: %o', values);
    // console.log('destinationTI: %o', destinationTI);
    // console.log('status: %o', destinationTI.identifiers?.status?.value);
    // console.log('name: %o', destinationTI.name);
    // console.log('publication type: %o', destinationTI.publicationType?.label);
    // console.log('related titels: %o', destinationTI.relatedTitles?.subType?.label);

  const destinationTitelSelected = () => (
    values?.electronicIdentifiers
  );

  return (
    <>
      <Card
        cardStyle={destinationTI?.id ? 'positive' : 'negative'}
        headerEnd={renderSourceTitleLinkButton(destinationTI?.id)}
        headerStart={(
          <AppIcon app="agreements" iconKey="eresource" size="small">
            <strong>
              {destinationTI?.id ? destinationTI?.name : <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" />}
              {destinationTI?.id ? ` . ${destinationTI.publicationType?.label}` : null}
            </strong>
          </AppIcon>
      )}
        roundedBorder
      >
        {renderIdentifierField() ? renderHeadLine() : null}
        {destinationTI?.vi?.identifier?.value}
        {destinationTI?.id ? renderIdentifierField() : renderEmptyDestination()}
        {destinationTI?.id ? renderRelatedIdentifierField() : null}
        {destinationTitelSelected() ? <PreviewForm destinationTI={destinationTI} /> : null}
      </Card>
    </>
  );
};

DestinationTitleIdentifierField.propTypes = propTypes;
export default DestinationTitleIdentifierField;
