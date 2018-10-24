import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
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
  };

  getAgreementLine(id) {
    return this.props.agreementLines.find(line => line.id === id);
  }

  onRemoveAgreementLine = (fields, id) => {

  }

  renderEresourceList = ({ fields }) => {
    const { agreementLines, intl } = this.props;
    const data = fields.getAll();

    if (!data || !data.length || !agreementLines || !agreementLines.length) {
      return 'No agreement lines';
    }

    return (
      <div>
        <MultiColumnList
          contentData={fields.getAll()}
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
            remove: (line) => {
              return (
                <IconButton
                  aria-label={intl.formatMessage({ id: 'ui-erm.basket.removeItem' })}
                  icon="trashBin"
                  onClick={() => { fields.remove(line.rowIndex); }}
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
          }}
          columnWidths={{
            name: '20%',
            platform: '20%',
            type: '10%',
          }}
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
