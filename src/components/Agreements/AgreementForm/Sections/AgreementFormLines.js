import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { get } from 'lodash';
import { FieldArray } from 'redux-form';

import {
  Accordion,
  Col,
  IconButton,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import BasketSelector from '../../../BasketSelector';
import EResourceLink from '../../../EResourceLink';
import ResourceType from '../../../ResourceType';
import AgreementLineField from '../components/AgreementLineField';

class AgreementFormEresources extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    intl: intlShape,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.object,
    stripes: PropTypes.object,
  };

  state = {
    addedLines: [],
  }

  getLineResource(line) {
    const { parentResources, agreementLines } = this.props;

    if (line.resource) return line.resource;

    if (parentResources && parentResources.basket) {
      const basketLine = parentResources.basket.find(l => l.id === line.id);
      if (basketLine) return basketLine;
    }

    if (agreementLines) {
      const foundLine = agreementLines.find(l => l.id === line.id);
      if (foundLine) return foundLine.resource;
    }

    return undefined;
  }

  onAddAgreementLine = (fields, resource) => {
    this.setState((prevState) => ({
      addedLines: [
        ...prevState.addedLines,
        { resource },
      ]
    }));

    fields.push({ resource });
  }

  onRemoveAgreementLine = (fields, rowIndex, id) => {
    // mod-agreements is implemented so that it doesn't expect the entire
    // array of agreement lines to be sent back on edits bc of the potential
    // size of that array. Instead, agreement line deletions are expected
    // to be sent back as an object that looks like { id: '123', _delete: true }.
    //
    // There's no "edit" function in redux-form fields so we remove
    // the stale data and append the new data with the deletion marker property.

    fields.remove(rowIndex);

    if (id) {
      fields.push({
        id,
        _delete: true,
      });
    }
  }

  renderField = ({ fields }) => {
    const { intl, stripes } = this.props;

    // Get the agreement lines and filter away lines that have been marked for deletion.
    const lines = fields.getAll() || [];
    const renderedLines = lines.filter(line => !line._delete);

    return (
      <div>
        <ul
          id="agreement-form-lines"
          style={{
            listStyle: 'none',
            padding: 0,
          }}
        >
          {renderedLines.map((line, i) => (
            <AgreementLineField
              fieldKey={i}
              key={i}
              line={line}
              onDelete={this.onR}
              resource={this.getLineResource(line)}
            />
          ))}
        </ul>
        <BasketSelector
          addButtonLabel={<FormattedMessage id="ui-agreements.agreementLines.createLine" />}
          onAdd={entitlement => this.onAddAgreementLine(fields, entitlement)}
          stripes={stripes}
        />
      </div>
    );
  /*
    return (
      <div>
        <MultiColumnList
          contentData={renderedLines}
          interactive={false}
          isEmptyMessage={<FormattedMessage id="ui-agreements.agreementLines.noLines" />}
          maxHeight={400}
          visibleColumns={[
            'name',
            'platform',
            'type',
            'count',
            'remove',
          ]}
          formatter={{
            name: (line) => {
              const resource = this.getLineResource(line);
              const title = get(resource, ['_object', 'pti', 'titleInstance'], resource);
              return <EResourceLink eresource={title} />;
            },
            platform: (line) => {
              const resource = this.getLineResource(line);
              return get(resource, ['_object', 'pti', 'platform', 'name']) ||
                get(resource, ['_object', 'nominalPlatform', 'name']);
            },
            type: (line) => {
              const resource = this.getLineResource(line);
              return <ResourceType resource={resource} />;
            },
            count: (line) => {
              const resource = this.getLineResource(line);
              return get(resource, ['_object', 'contentItems'], [0]).length; // If contentItems doesn't exist there's only one item.
            },
            remove: ({ rowIndex, id }) => {
              return (
                <FormattedMessage id="ui-agreements.agreementLines.removeItem">
                  {ariaLabel => (
                    <IconButton
                      aria-label={ariaLabel}
                      icon="trash"
                      onClick={() => this.onRemoveAgreementLine(fields, rowIndex, id)}
                    />
                  )}
                </FormattedMessage>
              );
            },
          }}
          columnMapping={{
            name: intl.formatMessage({ id: 'ui-agreements.eresources.name' }),
            platform: intl.formatMessage({ id: 'ui-agreements.eresources.platform' }),
            type: intl.formatMessage({ id: 'ui-agreements.eresources.erType' }),
            count: intl.formatMessage({ id: 'ui-agreements.agreementLines.count' }),
            contentUpdated: intl.formatMessage({ id: 'ui-agreements.agreementLines.contentUpdated' }),
            remove: intl.formatMessage({ id: 'ui-agreements.remove' }),
          }}
          columnWidths={{
            name: '35%',
            platform: '35%',
            type: '10%',
            count: '10%',
            remove: '10%'
          }}
        />
        <BasketSelector
          addButtonLabel={<FormattedMessage id="ui-agreements.agreementLines.createLine" />}
          onAdd={entitlement => this.onAddAgreementLine(fields, entitlement)}
          stripes={stripes}
        />
      </div>
    );
  */
  }

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementLines" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <FieldArray
              name="items"
              component={this.renderField}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default injectIntl(AgreementFormEresources);
