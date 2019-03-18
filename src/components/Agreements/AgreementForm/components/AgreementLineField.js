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
import ResourceType from '../../../ResourceType';

import CustomCoverageFieldArray from './CustomCoverageFieldArray';
import EditCard from './EditCard';

export default class AgreementLineField extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    onDelete: PropTypes.func,
    onResourceSelected: PropTypes.func,
    resource: PropTypes.object,
  }

  static defaultProps = {
    resource: {},
  }

  renderLineName = (resource) => {
    const title = get(resource, ['_object', 'pti', 'titleInstance'], resource);
    return <EResourceLink eresource={title} />;
  }

  renderLineType = (resource) => {
    return <ResourceType resource={resource} />;
  }

  renderLineTitles = (resource) => {
    // If contentItems doesn't exist there's only one item.
    return get(resource, ['_object', 'contentItems'], [0]).length;
  }

  renderLinePlatform = (resource) => {
    return (
      get(resource, ['_object', 'pti', 'platform', 'name']) ||
      get(resource, ['_object', 'nominalPlatform', 'name'])
    );
  }

  renderCustomCoverageSelector = () => {
    const { resource } = this.props;

    return (
      <FieldArray
        component={CustomCoverageFieldArray}
        name="coverage"
        resource={resource}
      />
    );
  }

  renderLineResource = () => {
    const { resource } = this.props;

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
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.platform" />}>
              <div data-test-ag-line-platform>{this.renderLinePlatform(resource)}</div>
            </KeyValue>
          </Col>
        </Row>
        {/* {this.renderCustomCoverageSelector()} */}
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
          resource.id ?
            this.renderLineResource() :
            this.renderLineSelector()
        }
      </EditCard>
    );
  }
}
