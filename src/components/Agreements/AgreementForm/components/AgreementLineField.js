import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import BasketSelector from '../../../BasketSelector';
import EResourceLink from '../../../EResourceLink';
import ResourceCount from '../../../ResourceCount';
import ResourceProvider from '../../../ResourceProvider';
import ResourceType from '../../../ResourceType';
import isExternal from '../../../../util/isExternal';
import isPackage from '../../../../util/isPackage';

import CustomCoverageFieldArray from './CustomCoverageFieldArray';
import EditCard from './EditCard';

export default class AgreementLineField extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    onResourceSelected: PropTypes.func,
    resource: PropTypes.object,
  }

  static defaultProps = {
    resource: {},
  }

  renderLineName = (resource) => {
    const dereferencedResource = get(resource, ['_object', 'pti', 'titleInstance'], resource);
    return <EResourceLink eresource={dereferencedResource} />;
  }

  renderLineType = (resource) => {
    return <ResourceType resource={resource} />;
  }

  renderLineTitles = (resource) => {
    return <ResourceCount resource={resource} />;
  }

  renderLineProvider = (resource) => {
    return <ResourceProvider resource={resource} />;
  }

  renderCustomCoverageSelector = () => {
    const { resource } = this.props;

    if (isPackage(resource)) return null;
    if (isExternal(resource)) return null;

    return (
      <FieldArray
        component={CustomCoverageFieldArray}
        name={`${this.props.name}.coverage`}
      />
    );
  }

  renderLineResource = () => {
    const { resource = {} } = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col xs={12} md={5}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.name" />}>
              <div data-test-ag-line-name>{this.renderLineName(resource)}</div>
            </KeyValue>
          </Col>
          <Col xs={12} md={2}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.type" />}>
              <div data-test-ag-line-type>{this.renderLineType(resource)}</div>
            </KeyValue>
          </Col>
          <Col xs={12} md={2}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.titles" />}>
              <div data-test-ag-line-titles>{this.renderLineTitles(resource)}</div>
            </KeyValue>
          </Col>
          <Col xs={12} md={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.provider" />}>
              <div data-test-ag-line-provider>{this.renderLineProvider(resource)}</div>
            </KeyValue>
          </Col>
        </Row>
        {this.renderCustomCoverageSelector()}
      </React.Fragment>
    );
  }

  renderLineSelector = () => {
    return (
      <BasketSelector
        addButtonLabel={<FormattedMessage id="ui-agreements.agreementLines.createLine" />}
        onAdd={resource => this.props.onResourceSelected(this.props.index, resource)}
      />
    );
  }

  render() {
    const { index, resource = {} } = this.props;

    return (
      <EditCard
        data-test-ag-line-number={index}
        header={<FormattedMessage id="ui-agreements.agreementLines.lineTitle" values={{ number: index + 1 }} />}
        onDelete={this.props.onDelete}
      >
        {
          (resource.id || resource.reference) ?
            this.renderLineResource() :
            this.renderLineSelector()
        }
      </EditCard>
    );
  }
}
