import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState, useForm } from 'react-final-form';
import { Link } from 'react-router-dom';

import {
  Checkbox,
  Tooltip,
  Button,
  Card,
  Layout,
  Row,
  Col,
  Headline,
  KeyValue,
} from '@folio/stripes/components';

import { AppIcon, Pluggable } from '@folio/stripes/core';
import css from '../../../styles.css';
import { urls } from '../../../utilities';

const propTypes = {
  formRestart: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  previewModal: PropTypes.bool,
};

const SourceTitleIdentifierField = ({ formRestart, previewModal }) => {
  let triggerButton = useRef(null);

  const { initialValues, values } = useFormState();
  const initialSourceTI = initialValues?.sourceTI?.ti._object;
  const [sourceTI, setSourceTI] = useState(initialSourceTI ?? {});
  const { change } = useForm();

  useEffect(() => {
    if (initialSourceTI) {
      setSourceTI(initialSourceTI);
    }
  }, [initialSourceTI]);

  const renderSourceTitleLinkButton = (value) => (
    <>
      <Field
        name="sourceTitleInstance"
        render={() => {
          const handleSetSourceTI = (ti) => {
            setSourceTI(ti._object);
            change('sourceTitleInstance', ti.id);
            formRestart();
          };

          return (
            <Pluggable
              dataKey="sourceIdentifierLookup"
              onEresourceSelected={handleSetSourceTI}
              renderTrigger={(pluggableRenderProps) => {
              triggerButton = pluggableRenderProps.buttonRef;
              const eresourceName = sourceTI?.name;
              const buttonProps = {
                'aria-haspopup': 'true',
                'buttonRef': triggerButton,
                'buttonStyle': value ? 'default' : 'primary',
                'id': 'sourceIdentifierLookup-find-eresource-btn',
                'marginBottom0': true,
                'onClick': pluggableRenderProps.onClick
              };

              if (value) {
                return (
                  <Tooltip
                    id="sourceIdentifierLookup-title-button-tooltip"
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

  const renderHeadLine = () => (
    <Headline size="large" tag="h3">
      <FormattedMessage id="ui-agreements.identifiers.identifiersToMove" />
    </Headline>
  );

  const renderEmptySource = () => (
    <div>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-agreements.eresource.moveIdentifier.noSourceTitle" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.eresource.sourceTitleSelectionText" />
      </Layout>
    </div>
  );

  const renderElectronicIdentifier = () => (
    <KeyValue>
      <strong>{sourceTI?.subType?.label}</strong>
    </KeyValue>
  );

  const renderIdentifierField = () => {
    const validIdentifiers = sourceTI?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');
    return (
      validIdentifiers?.map((vi, index) => {
        return (
          <>
            {previewModal ?
              <Row>
                <Col>
                  <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
                    <div>
                      {sourceTI?.subType?.label}
                    </div>
                  </KeyValue>
                </Col>
              </Row>
              :
              <Row>
                <Col md={6} xs={12}>
                  <Field
                    key={`${sourceTI?.id}.${vi?.identifier?.ns?.value}.${vi?.identifier?.value} electroniceIdentifiers`}
                    component={Checkbox}
                    id="source-title-identifier"
                    label={`${vi?.identifier?.ns?.value}: ${vi?.identifier?.value}`}
                    // name="identifiersSelected"
                    name={`${sourceTI?.id}.${vi?.identifier?.ns?.value}.${vi?.identifier?.value}`}
                    type="checkBox"
                  />
                </Col>
              </Row>
            }
          </>
        );
      })
    );
  };

  const renderRelatedTitleField = (relatedTitle) => {
    // for now we assume that the related titles are print
    const printIdentifiers = relatedTitle?.identifiers?.filter(rtId => rtId?.status?.value === 'approved');
    return (
      printIdentifiers?.map((pi) => {
        return (
          <>
            <br /><div className={css.separator} />
            {previewModal ?
              <Row>
                <Col md={6} xs={12}>
                  <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
                    <div>
                      {relatedTitle?.subType?.label}
                    </div>
                  </KeyValue>
                </Col>
                <Col md={6} xs={12}>
                  <KeyValue label={pi?.identifier?.ns?.value}>
                    <div>
                      {pi?.identifier?.value}
                    </div>
                  </KeyValue>
                </Col>
              </Row>
              :
              <Row>
                <Col md={6} xs={12}>
                  <KeyValue>
                    <strong>{relatedTitle?.subType?.label}</strong>
                  </KeyValue>
                  <Field
                    key={`${relatedTitle?.id}.${pi?.identifier?.ns?.value}.${pi?.identifier?.value}`}
                    component={Checkbox}
                    id="source-title-identifier"
                    label={`${pi?.identifier?.ns?.value}: ${pi?.identifier?.value}`}
                  // name={`${relatedTitle?.id}.${pi?.identifier?.ns?.value}.${pi?.identifier?.value} printIdentifiers`}
                    name="printIdentifiers"
                    type="checkbox"
                  />
                </Col>
              </Row>
            }
          </>
        );
      })
    );
  };

  return (
    <>
      {previewModal ?
        <Card
          cardStyle="positive"
          headerStart={(
            <AppIcon app="agreements" iconKey="eresource" size="small">
              <strong>
                {sourceTI.id ?
                  <Link target="_blank" to={urls.eresourceView(sourceTI?.id)}>
                    {sourceTI?.id ? sourceTI?.name : <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
                  </Link>
                    :
                  <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
              </strong>
            </AppIcon>
        )}
          roundedBorder
        >
          {renderIdentifierField()}
          {sourceTI?.id ? renderIdentifierField() : null}
          {sourceTI?.id ? sourceTI?.relatedTitles?.map(rt => renderRelatedTitleField(rt)) : null}
        </Card>
          :
        <Card
          cardStyle={sourceTI?.id ? 'positive' : 'negative'}
          headerEnd={renderSourceTitleLinkButton(sourceTI?.id)}
          headerStart={(
            <AppIcon app="agreements" iconKey="eresource" size="small">
              <strong>
                {sourceTI.id ?
                  <Link target="_blank" to={urls.eresourceView(sourceTI?.id)}>
                    {sourceTI?.id ? sourceTI?.name : <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
                  </Link>
                  :
                  <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
                {sourceTI?.id ? ` . ${sourceTI.publicationType?.label}` : null}
              </strong>
            </AppIcon>
          )}
          roundedBorder
        >
          {renderIdentifierField() ? renderHeadLine() : null}
          {renderIdentifierField() ? renderElectronicIdentifier() : null}
          {sourceTI?.id ? renderIdentifierField() : renderEmptySource()}
          {sourceTI?.id ? sourceTI?.relatedTitles?.map(rt => renderRelatedTitleField(rt)) : null}
        </Card>
        }
    </>
  );
};

SourceTitleIdentifierField.propTypes = propTypes;
export default SourceTitleIdentifierField;
