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
} from '@folio/stripes/components';

import { AppIcon, Pluggable } from '@folio/stripes/core';
import css from '../../../styles.css';
import PreviewForm from '../PreviewForm';

const propTypes = {
  formRestart: PropTypes.func.isRequired,
  // sourceTI: PropTypes.shape({
  //   id: PropTypes.string,
  //   identifiers: PropTypes.arrayOf(PropTypes.shape({
  //     identifier: PropTypes.shape({
  //       ns: PropTypes.shape({
  //         value: PropTypes.string,
  //       }),
  //       value: PropTypes.string,
  //     }),
  //   })),
  //   longName: PropTypes.string,
  //     name: PropTypes.string,
  //     subType: PropTypes.shape({
  //       id: PropTypes.string,
  //       label: PropTypes.string,
  //       value: PropTypes.string,
  //     }),
  //     type: PropTypes.shape({
  //       id: PropTypes.string,
  //       label: PropTypes.string,
  //       value: PropTypes.string,
  //     }),
  //   }).isRequired,
};

const SourceTitleIdentifierField = ({ formRestart }) => {
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

  const renderIdentifierField = () => {
    const validIdentifiers = sourceTI?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');
    return (
      validIdentifiers?.map((vi, index) => {
        return (
          <>
            <strong>{sourceTI?.subType?.label}</strong>
            <Row>
              <Col xs={12}>
                <Field
                  key={vi.id}
                  component={Checkbox}
                  id="source-title-identifier"
                  label={`${vi?.identifier?.ns?.value}: ${vi?.identifier?.value}`}
                  name="electronicIdentifiers"
                  type="checkBox"
                />
              </Col>
            </Row>
          </>
        );
      })
    );
  };

  const renderRelatedTitelsField = () => {
    const validIdentifiers = sourceTI?.relatedTitles?.filter(rTiId => rTiId?.type?.value === 'serial');
    return (
      validIdentifiers?.map((vi, index) => {
        return (
          <>
            <strong>{sourceTI?.relatedTitles?.subType?.label}</strong>
            <div className={css.separator} />
            {sourceTI?.type?.value === 'serial' ?
              <Row>
                <Col>
                  <Field
                    key={vi.id}
                    component={Checkbox}
                    id="source-title-identifier"
                    inline
                    label={`${vi?.identifier?.ns?.value}: ${vi?.identifier?.value}`}
                    name="printIdentifiers"
                    type="checkbox"
                  />
                </Col>
              </Row>
            : null
           }
          </>
        );
      })
    );
  };


  const sourceTitelSelected = () => (
    values?.electronicIdentifiers || values?.printIdentifiers
    // values?.electronicIdentifiers && values?.printIdentifiers
    );

  console.log('SourceTI: %o', sourceTI);
  // console.log('status: %o', sourceTI?.type?.label);
  // console.log('related titels: %o', sourceTI?.relatedTitles?.type?.label);

  return (
    <>
      <Card
        cardStyle={sourceTI?.id ? 'positive' : 'negative'}
        headerEnd={renderSourceTitleLinkButton(sourceTI?.id)}
        headerStart={(
          <AppIcon app="agreements" iconKey="eresource" size="small">
            <strong>
              {sourceTI?.id ? sourceTI?.name : <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
              {sourceTI?.id ? ` . ${sourceTI.publicationType?.label}` : null}
            </strong>
          </AppIcon>
      )}
        roundedBorder
      >
        {renderIdentifierField() ? renderHeadLine() : null}
        {sourceTI?.id ? renderIdentifierField() : renderEmptySource()}
        {sourceTI?.id ? renderRelatedTitelsField() : null}
        {sourceTitelSelected() ? <PreviewForm sourceTI={sourceTI} /> : null}
      </Card>
    </>
  );
};

SourceTitleIdentifierField.propTypes = propTypes;
export default SourceTitleIdentifierField;
