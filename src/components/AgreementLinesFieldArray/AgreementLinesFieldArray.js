import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { Button, Layout } from '@folio/stripes/components';
import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import IfEResourcesEnabled from '../IfEResourcesEnabled';
import { isExternal } from '../utilities';

import AgreementLineField from './AgreementLineField';

class AgreementLinesFieldArray extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      basket: PropTypes.array,
      agreementLines: PropTypes.array,
      orderLines: PropTypes.array,
    }),
    items: PropTypes.arrayOf(PropTypes.object),
    meta: PropTypes.shape({
      error: PropTypes.object,
    }),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onReplaceField: PropTypes.func.isRequired,
  }

  getLinePOLine = (line) => {
    if (!line.poLineId || !this.props.data.orderLines) return undefined;
    return this.props.data.orderLines.find(orderLine => orderLine.id === line.poLineId);
  }

  getLineResource = (line) => {
    const { data: { agreementLines } } = this.props;

    if (line.resource) return line.resource;

    if (line.id) {
      const savedLine = agreementLines.find(l => l.id === line.id);
      if (savedLine) {
        return isExternal(savedLine) ? savedLine : savedLine.resource;
      }
    }

    if (isExternal(line)) {
      return line;
    }

    return undefined;
  }

  handleAddLine = () => {
    this.props.onAddField({});
  }

  handleResourceSelected = (index, resource) => {
    this.props.onReplaceField(index, { resource });
  }

  validateResourceIsSelected = (value = {}) => {
    if (Object.keys(value).length === 0) {
      return <FormattedMessage id="ui-agreements.errors.unsetAgreementLines" />;
    }

    return undefined;
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.agreementLines.noLines" />
    </Layout>
  )

  renderLines = () => {
    return this.props.items.map((line, i) => (
      <Field
        basket={this.props.data.basket}
        component={AgreementLineField}
        index={i}
        key={i}
        name={`${this.props.name}[${i}]`}
        onDelete={() => this.props.onDeleteField(i, line)}
        onResourceSelected={this.handleResourceSelected}
        poLine={this.getLinePOLine(line)}
        resource={this.getLineResource(line)}
        validate={this.validateResourceIsSelected}
      />
    ));
  }

  render() {
    return (
      <div>
        {/* { this.renderError() } */}
        <div id="agreement-form-lines">
          {this.props.items.length ? this.renderLines() : this.renderEmpty()}
        </div>
        <IfEResourcesEnabled>
          <Button id="add-agreement-line-button" onClick={this.handleAddLine}>
            <FormattedMessage id="ui-agreements.agreementLines.addLine" />
          </Button>
        </IfEResourcesEnabled>
      </div>
    );
  }
}

export default withKiwtFieldArray(AgreementLinesFieldArray);
