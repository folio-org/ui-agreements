import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState, useForm } from 'react-final-form';
import { Link } from 'react-router-dom';

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
import css from '../../../styles.css';
import { urls } from '../../../utilities';


const propTypes = {
  formRestart: PropTypes.func.isRequired,
  previewModal: PropTypes.bool,
};

const DestinationTitleIdentifierField = ({ formRestart, previewModal }) => {
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
      <Headline size="large" tag="h3">
        <FormattedMessage id="ui-agreements.identifiers.identifierDestination" />
      </Headline>
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

  // const renderHeadLine = () => (

  // );

  const renderDestinationTitleLinkButton = (value) => (
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

  const renderIdentifierRadioButtons = (title) => {
    console.log('destinationTIsource TI: %o', title);
    const validIdentifiers = title?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');
    return (
      <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
      {validIdentifiers?.map((vi, index) => {
        return (
          <>
            {previewModal ?
              <Row>
                <Col md={6} xs={12}>
                  <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
                    <div>
                      {title?.subType?.label}
                    </div>
                  </KeyValue>
                </Col>
                <Col md={6} xs={12}>
                  <KeyValue label={vi?.identifier?.ns?.value}>
                    <div>
                      {vi?.identifier?.value}
                    </div>
                  </KeyValue>
                </Col>
              </Row>
              :
              <RadioButtonGroup>
                  <Col md={6} xs={12}>
                    <Field
                      key={index}
                      component={RadioButton}
                      label={<KeyValue label={vi?.identifier?.ns?.value}>
                        {vi?.identifier?.value}
                      </KeyValue>}
                      name="identifiersName"
                      value={validIdentifiers?.identifier?.value}
                    />
                  </Col>

              </RadioButtonGroup>
            }
          </>
        );
      })}
      </KeyValue>
    );
  };

  // const renderRelatedTitleField = (relatedTitle) => {
  //   const printIdentifiers = relatedTitle?.identifiers?.filter(rtId => rtId?.status?.value === 'approved');
  //   console.log('related title: %o', relatedTitle);
  //   return (
  //     printIdentifiers?.map((pi, index) => {
  //       return (
  //         <>
  //           <div className={css.separator} />
  //           {previewModal ?
  //             <Row>
  //               <Col>
  //                 <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
  //                   <div>
  //                     {relatedTitle?.subType?.label}
  //                   </div>
  //                 </KeyValue>
  //               </Col>
  //             </Row>
  //             :
  //             <RadioButtonGroup>
  //               <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
  //                 <Row>
  //                   <Col md={6} xs={12}>
  //                     <RadioButton
  //                       key={index}
  //                       label={relatedTitle?.subType?.label}
  //                       name="identifiersName"
  //                       value={pi?.identifier?.value}
  //                     />
  //                   </Col>
  //                 </Row>
  //               </KeyValue>
  //               <KeyValue label={pi?.identifier?.ns?.value}>
  //                 {pi?.identifier?.value}
  //               </KeyValue>
  //             </RadioButtonGroup>
  //             }
  //         </>
  //       );
  //     })
  //   );
  // };

  console.log('formValues destination Identifier: %o', values);

  return (
    <>
      {previewModal ?
        <Card
          cardStyle="positive"
          headerStart={(
            <AppIcon app="agreements" iconKey="eresource" size="small">
              <strong>
                {destinationTI.id ?
                  <Link target="_blank" to={urls.eresourceView(destinationTI?.id)}>
                    {destinationTI?.id ? destinationTI?.name : <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
                  </Link>
                      :
                  <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
              </strong>
            </AppIcon>
    )}
          roundedBorder
        >
          {renderIdentifierRadioButtons(destinationTI)}
          {destinationTI?.id ? renderIdentifierRadioButtons() : null}
          {destinationTI?.id ? destinationTI?.relatedTitles?.map(rt => renderIdentifierRadioButtons(rt)) : null}
        </Card>
          :
        <Card
          cardStyle={destinationTI?.id ? 'positive' : 'negative'}
          headerEnd={renderDestinationTitleLinkButton(destinationTI?.id)}
          headerStart={(
            <AppIcon app="agreements" iconKey="eresource" size="small">
              <strong>
                {destinationTI.id ?
                  <Link to={urls.eresourceView(destinationTI?.id)}>
                    {destinationTI?.id ? destinationTI?.name : <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" />}
                  </Link>
              :
                  <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
                {destinationTI?.id ? ` . ${destinationTI.publicationType?.label}` : null}
              </strong>
            </AppIcon>
      )}
          roundedBorder
        >
          {/* {renderIdentifierRadioButtons(destinationTI) ? renderHeadLine() : null} */}
          {/* {destinationTI?.vi?.identifier?.value} */}
          {destinationTI?.id ? renderIdentifierRadioButtons(destinationTI) : renderEmptyDestination()}
          {destinationTI?.id ? destinationTI?.relatedTitles?.map(rt => renderDestinationTitleLinkButton(rt)) : null}
        </Card>
    }
    </>
  );
};

DestinationTitleIdentifierField.propTypes = propTypes;
export default DestinationTitleIdentifierField;
