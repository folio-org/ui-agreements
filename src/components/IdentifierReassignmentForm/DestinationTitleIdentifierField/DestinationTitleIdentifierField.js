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
import css from '../../styles.css';
import { urls } from '../../utilities';


const propTypes = {
  formRestart: PropTypes.func,
  previewModal: PropTypes.bool,
  setTitleName: PropTypes.func,
};

const DestinationTitleIdentifierField = ({ setTitleName }) => {
  let triggerButton = useRef(null);
  const [destinationTI, setDestinationTI] = useState();

  const { values } = useFormState();
  const { change } = useForm();

  useEffect(() => {
    const initialDestinationTI = values?.destinationTIObject;
    if (initialDestinationTI) {
      setDestinationTI(initialDestinationTI);
    }
  }, [change, values?.destinationTIObject]);

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

  const renderDestinationTitleLinkButton = (value) => (
    <Field
      // This field holds the dest title object
      name="destinationTIObject"
      render={() => (
        <Pluggable
          dataKey="destinationIdentifierLookup"
          onEresourceSelected={ti => {
            setDestinationTI(ti._object);
            change('destinationTIObject', ti?._object);
            change('destinationTitle');
          }}
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
          showPackages={false}
          type="find-eresource"
        >
          <FormattedMessage id="ui-agreements.moveIdentifiers.noPlugin" />
        </Pluggable>
      )}
    />
  );

  const renderTitleRadioButton = (title) => {
    const validIdentifiers = title?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');
    return (
      <Row>
        <Col md={6} xs={12}>
          <RadioButtonGroup>
            <Field
              key={title.id}
              component={RadioButton}
              label={<KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>{title?.subType?.label}</KeyValue>}
              name="destinationTitle"
              type="radio"
              value={title?.id}
            />
          </RadioButtonGroup>
        </Col>
        <Col md={6} xs={12}>
          {validIdentifiers?.map((vi, index) => {
            return (
              <KeyValue
                key={`title-${title?.id}-identifier[${index}]`}
                label={vi?.identifier?.ns?.value}
              >
                {vi?.identifier?.value}
              </KeyValue>
            );
          })}
        </Col>
      </Row>
    );
  };

  const renderTitleFields = () => {
    return (
      <>
        <Headline size="large" tag="h3">
          <FormattedMessage id="ui-agreements.identifiers.identifierDestination" />
        </Headline>
        {renderTitleRadioButton(destinationTI)}
        {destinationTI?.relatedTitles?.map(rt => (
          <>
            <div className={css.separator} />
            {renderTitleRadioButton(rt)}
          </>
        ))}
      </>
    );
  };

  return (
    <Card
      cardStyle={destinationTI?.id ? 'positive' : 'negative'}
      data-testid="destinationTitleCard"
      headerEnd={renderDestinationTitleLinkButton(destinationTI?.id)}
      headerStart={(
        <AppIcon app="agreements" iconKey="title" size="small">
          <strong>
            {destinationTI?.id ?
              <>
                <Link to={urls.titleView(destinationTI?.id)}>
                  {destinationTI?.name}
                </Link>
                <> · {destinationTI?.publicationType?.label}</>
              </>
              :
              <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
          </strong>
        </AppIcon>
      )}
      roundedBorder
    >
      {destinationTI?.id ? renderTitleFields() : renderEmptyDestination()}
      {destinationTI?.id ? setTitleName(destinationTI.name) : null}
    </Card>
  );
};

DestinationTitleIdentifierField.propTypes = propTypes;
export default DestinationTitleIdentifierField;
