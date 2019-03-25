import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Layout,
} from '@folio/stripes/components';

import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import AgreementLineField from './AgreementLineField';

class AgreementLinesFieldArray extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onReplaceField: PropTypes.func.isRequired,
    parentResources: PropTypes.object,
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

  handleResourceSelected = (index, resource) => {
    this.props.onReplaceField(index, { resource });
  }

  handleAddLine = () => {
    this.props.onAddField({});
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.agreementLines.noLines" />
    </Layout>
  )

  renderLines = () => {
    return this.props.items.map((line, i) => (
      <AgreementLineField
        key={i}
        index={i}
        line={line}
        name={`${this.props.name}[${i}]`}
        onDelete={() => this.props.onDeleteField(i, line)}
        onResourceSelected={this.handleResourceSelected}
        resource={this.getLineResource(line)}
      />
    ));
  }

  render = () => {
    return (
      <div>
        <div id="agreement-form-lines">
          { this.props.items.length ? this.renderLines() : this.renderEmpty() }
        </div>
        <Button id="add-agreement-line-button" onClick={this.handleAddLine}>
          <FormattedMessage id="ui-agreements.agreementLines.addLine" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(AgreementLinesFieldArray);
