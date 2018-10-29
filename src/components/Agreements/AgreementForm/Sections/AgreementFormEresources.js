import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { get } from 'lodash';
import { FieldArray } from 'redux-form';
import Link from 'react-router-dom/Link';

import {
  Accordion,
  Col,
  IconButton,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';

import { renderResourceType } from '../../../../util/resourceType';
import BasketSelector from '../../../BasketSelector';

class AgreementFormEresources extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    intl: intlShape,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  state = {
    addedLines: [],
  }

  getLineResource(line) {
    if (line.resource) return line.resource;

    const foundLine = this.props.agreementLines.find(l => l.id === line.id);
    if (foundLine) return foundLine.resource;

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
    // mod-erm is implemented so that it doesn't expect the entire
    // array of agreement lines to be sent back on edits bc of the potential
    // size of that array. Instead, agreement line deletions are expected
    // to be sent back as an object that looks like { id: '123', _delete: true }.
    //
    // Since there's no "edit" function in redux-form fields so we remove
    // the stale data and append the new data with the deletion marker property.

    fields.remove(rowIndex);

    if (id) {
      fields.push({
        id,
        _delete: true,
      });
    }
  }

  renderEresourceList = ({ fields }) => {
    const { agreementLines, intl, stripes } = this.props;

    if (!agreementLines || !agreementLines.length) {
      return <FormattedMessage id="ui-erm.agreementLines.noLines" />;
    }

    // Get the agreement lines and filter away lines that have been marked for deletion.
    const data = fields.getAll().filter(line => !line._delete);

    if (!data.length) {
      return <FormattedMessage id="ui-erm.agreementLines.noLines" />;
    }

    return (
      <div>
        <MultiColumnList
          contentData={data}
          interactive={false}
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
              return <Link to={`/erm/eresources/view/${title.id}`}>{title.name}</Link>;
            },
            platform: (line) => {
              const resource = this.getLineResource(line);
              return get(resource, ['_object', 'pti', 'platform', 'name']) ||
                get(resource, ['_object', 'nominalPlatform', 'name']);
            },
            type: (line) => {
              const resource = this.getLineResource(line);
              return resource ? renderResourceType(resource) : '';
            },
            count: (line) => {
              const resource = this.getLineResource(line);
              return get(resource, ['_object', 'contentItems'], [0]).length; // If contentItems doesn't exist there's only one item.
            },
            remove: ({ rowIndex, id }) => {
              return (
                <IconButton
                  aria-label={intl.formatMessage({ id: 'ui-erm.agreementLines.removeItem' })}
                  icon="trashBin"
                  onClick={() => this.onRemoveAgreementLine(fields, rowIndex, id)}
                />
              );
            },
          }}
          columnMapping={{
            name: intl.formatMessage({ id: 'ui-erm.eresources.name' }),
            platform: intl.formatMessage({ id: 'ui-erm.eresources.platform' }),
            type: intl.formatMessage({ id: 'ui-erm.eresources.erType' }),
            count: intl.formatMessage({ id: 'ui-erm.agreementLines.count' }),
            contentUpdated: intl.formatMessage({ id: 'ui-erm.agreementLines.contentUpdated' }),
            remove: intl.formatMessage({ id: 'ui-erm.remove' }),
          }}
          columnWidths={{
            name: '20%',
            platform: '20%',
            type: '10%',
          }}
        />
        <BasketSelector
          addButtonLabel={intl.formatMessage({ id: 'ui-erm.agreementLines.createLine' })}
          onAdd={entitlement => this.onAddAgreementLine(fields, entitlement)}
          stripes={stripes}
        />
      </div>
    );
  }

  render() {
    const { intl } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.agreements.eresourceAgreementLines' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <FieldArray
              name="items"
              component={this.renderEresourceList}
              // toUpdate={this.state.lastAction} // TODO figure out (from EditableListForm)
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default injectIntl(AgreementFormEresources);
