import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Layout,
} from '@folio/stripes/components';

import AgreementLineField from './AgreementLineField';
import css from './AgreementLinesFieldArray.css';

export default class AgreementLinesFieldArray extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    fields: PropTypes.object,
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
    this.props.fields.remove(index);
    this.props.fields.insert(index, { resource });
  }

  handleDeleteLine = (index, line) => {
    const { fields } = this.props;

    fields.remove(index);

    if (line.id) {
      fields.push({ id: line.id, _delete: true });
    }
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.agreementLines.noLines" />
    </Layout>
  )

  renderLines = (lines) => {
    return lines.map((line, i) => (
      <AgreementLineField
        key={i}
        index={i}
        line={line}
        onDelete={() => this.handleDeleteLine(i, line)}
        onResourceSelected={this.handleResourceSelected}
        resource={this.getLineResource(line)}
      />
    ));
  }

  render = () => {
    const { fields } = this.props;

    // Get the agreement lines and filter away lines that have been marked for deletion.
    const lines = (fields.getAll() || []).filter(line => !line._delete);

    return (
      <div>
        <ul id="agreement-form-lines" className={css.agLineFieldArray}>
          { lines.length ? this.renderLines(lines) : this.renderEmpty() }
        </ul>
        <Button id="add-agreement-line-button" onClick={() => fields.push({})}>
          <FormattedMessage id="ui-agreements.agreementLines.addLine" />
        </Button>
      </div>
    );
  }
}
