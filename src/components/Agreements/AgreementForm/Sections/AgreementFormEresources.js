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

class AgreementFormEresources extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    intl: intlShape,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    touch: PropTypes.func,
  };

  getAgreementLine(id) {
    return this.props.agreementLines.find(line => line.id === id);
  }

  onRemoveAgreementLine = (fields, id, rowIndex) => {
    // mod-erm is implemented so that it doesn't expect the entire
    // array of agreement lines to be sent back on edits bc of the potential
    // size of that array. Instead, agreement line deletions are expected
    // to be sent back as an object that looks like { id: '123', _delete: true }.
    //
    // Since there's no "edit" function in redux-form fields so we remove
    // the stale data and append the new data.

    fields.remove(rowIndex);
    fields.push({
      id,
      _delete: true,
    });
  }

  renderEresourceList = ({ fields }) => {
    const { agreementLines, intl } = this.props;

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
            name: ({ id }) => {
              const line = this.getAgreementLine(id);
              const resource = get(line.resource, ['_object', 'pti', 'titleInstance'], line.resource);
              return <Link to={`/erm/eresources/view/${resource.id}`}>{resource.name}</Link>;
            },
            platform: ({ id }) => {
              const line = this.getAgreementLine(id);
              return get(line, ['resource', '_object', 'pti', 'platform', 'name']) ||
                get(line, ['resource', '_object', 'nominalPlatform', 'name']);
            },
            type: ({ id }) => {
              const line = this.getAgreementLine(id);
              return line ? renderResourceType(this.getAgreementLine(id).resource) : '';
            },
            count: ({ id }) => {
              const line = this.getAgreementLine(id);
              return get(line, ['_object', 'contentItems'], [0]).length; // If contentItems doesn't exist there's only one item.
            },
            remove: ({ id, rowIndex }) => {
              return (
                <IconButton
                  aria-label={intl.formatMessage({ id: 'ui-erm.agreementLines.removeItem' })}
                  icon="trashBin"
                  onClick={() => this.onRemoveAgreementLine(fields, id, rowIndex)}
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
        {/* <AutoSuggest /> */}
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
