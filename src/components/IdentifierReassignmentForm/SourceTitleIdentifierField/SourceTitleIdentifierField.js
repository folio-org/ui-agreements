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
import css from '../../styles.css';
import { urls } from '../../utilities';

const propTypes = {
  previewModal: PropTypes.bool,
  setTitleName: PropTypes.func
};

const SourceTitleIdentifierField = ({ setTitleName }) => {
  let triggerButton = useRef(null);

  const { values } = useFormState();
  const [sourceTI, setSourceTI] = useState({});
  const { change } = useForm();

  useEffect(() => {
    const initialSourceTI = values?.sourceTIObject;
    if (initialSourceTI) {
      setSourceTI(initialSourceTI);
    }
  }, [change, values?.sourceTIObject]);

  const renderSourceTitleLinkButton = (value) => (
    <Field
      id="sourceTIObject"
      // This field holds the sourceTI object
      name="sourceTIObject"
      render={() => (
        <Pluggable
          dataKey="sourceIdentifierLookup"
          onEresourceSelected={ti => {
            // Change any keys that are not destination metadata
            Object.keys(values).forEach(key => {
              if (
                key !== 'destinationTIObject' &&
                key !== 'destinationTitle'
              ) {
                change(key);
              }
            });

            setSourceTI(ti._object);
            change('sourceTIObject', ti._object);
          }}
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
          showPackages={false}
          type="find-eresource"
        >
          <FormattedMessage id="ui-agreements.moveIdentifiers.noPlugin" />
        </Pluggable>
      )}
    />
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

  const renderTitleIdentifierFields = (title) => {
    const validIdentifiers = title?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');
    const groupedIdentifiers = validIdentifiers.reduce((arr, curr) => {
      const newArr = { ...arr };
      newArr[curr.identifier?.ns?.value] = [...(newArr[curr.identifier?.ns?.value] ?? []), curr.identifier?.value];

      return newArr;
    }, {});

    /*
     * Thanks to final form having opinions about numeric keys ALWAYS creating objects,
     * we are forced to manually construct a submit object containing an array of values instead,
     * to avoid having to parse those arrays (which could have lengths in the 10s of thousands)
     * This grouping will take the shape:
     *
      {
        issn: ['2092-6731', '8237-3432'],
        ezb: ['34567']
      }
    */
    const renderGroupedIdentifiers = () => (
      Object.entries(groupedIdentifiers).map(identifierConfig => {
        const [identifierNamespace, identifierValues] = identifierConfig;

        return (
          identifierValues?.map((vi, index) => (
            <div data-testid="source-title-identifier-field">
              <Row
                key={`${title.id}.${identifierNamespace}.${vi}-electronicIdentifiers-row`}
              >
                <Col md={6} xs={12}>
                  <Field
                    key={`${title.id}.${identifierNamespace}.${vi}-electronicIdentifiers`}
                    checked={values?.[`${title.id}`]?.[`${identifierNamespace}`]?.includes(vi)}
                    component={Checkbox}
                    id={`source-title-identifier-field-${title.id}-${identifierNamespace}[${index}]`}
                    label={`${identifierNamespace}: ${vi}`}
                    name={`${title.id}.${identifierNamespace}[${index}]`}
                    onChange={e => {
                      if (e.target.checked) {
                        change(`${title.id}.${identifierNamespace}[${index}]`, vi);
                      } else {
                        change(`${title.id}.${identifierNamespace}[${index}]`);
                      }
                    }}
                    type="checkBox"
                  />
                </Col>
              </Row>
            </div>
          ))
        );
      })
    );

    return (
      <>
        <KeyValue>
          <strong>{title?.subType?.label}</strong>
        </KeyValue>
        {renderGroupedIdentifiers()}
      </>
    );
  };

  const renderTitleFields = () => (
    <>
      <Headline size="large" tag="h3">
        <FormattedMessage id="ui-agreements.identifiers.identifiersToMove" />
      </Headline>
      <Layout className="padding-bottom-gutter">
        {renderTitleIdentifierFields(sourceTI)}
      </Layout>
      <div />
      {sourceTI?.relatedTitles?.map(rt => (
        <>
          <div className={css.separator} />
          {renderTitleIdentifierFields(rt)}
        </>
      ))}
    </>
  );

  return (
    <Card
      cardStyle={sourceTI?.id ? 'positive' : 'negative'}
      data-testid="sourceTitleCard"
      headerEnd={renderSourceTitleLinkButton(sourceTI?.id)}
      headerStart={(
        <AppIcon app="agreements" iconKey="title" size="small">
          <strong>
            {sourceTI?.id ?
              <>
                <Link target="_blank" to={urls.titleView(sourceTI?.id)}>
                  {sourceTI.name}
                </Link>
                <> · {sourceTI.publicationType?.label}</>
              </>
              :
              <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
          </strong>
        </AppIcon>
      )}
      roundedBorder
    >
      {sourceTI?.id ? renderTitleFields() : renderEmptySource()}
      {sourceTI?.id ? setTitleName(sourceTI.name) : null}
    </Card>
  );
};

SourceTitleIdentifierField.propTypes = propTypes;
export default SourceTitleIdentifierField;
