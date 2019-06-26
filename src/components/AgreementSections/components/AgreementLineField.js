import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Col, Icon, KeyValue, Row } from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';

import BasketSelector from '../../BasketSelector';
import EResourceLink from '../../EResourceLink';
import ResourceCount from '../../ResourceCount';
import ResourceProvider from '../../ResourceProvider';
import ResourceType from '../../ResourceType';
import { isExternal, isPackage } from '../../utilities';

import CustomCoverageFieldArray from './CustomCoverageFieldArray';

export default class AgreementLineField extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onDelete: PropTypes.func,
    onResourceSelected: PropTypes.func,
    resource: PropTypes.object,
  }

  static defaultProps = {
    resource: {},
  }

  renderLineName = (resource) => {
    const dereferencedResource = get(resource, '_object.pti.titleInstance', resource);
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
    const { input: { name }, resource } = this.props;

    if (isPackage(resource)) return null;
    if (isExternal(resource)) return null;

    return (
      <FieldArray
        component={CustomCoverageFieldArray}
        name={`${name}.coverage`}
      />
    );
  }

  renderLineResource = () => {
    const { resource = {} } = this.props;

    return (
      <div>
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
      </div>
    );
  }

  renderLineSelector = () => {
    const { meta: { error } } = this.props;

    return (
      <BasketSelector
        addButtonLabel={<FormattedMessage id="ui-agreements.agreementLines.createLine" />}
        basket={this.props.basket}
        error={React.isValidElement(error) ? error : undefined}
        onAdd={resource => this.props.onResourceSelected(this.props.index, resource)}
      />
    );
  }

  // renderError = error => (
  //   <div className={css.error}>
  //     <Icon size="medium" icon="exclamation-circle" status="error">
  //       {error}
  //     </Icon>
  //   </div>
  // )

  render() {
    const { index, meta: { error }, resource = {} } = this.props;

    return (
      <EditCard
        data-test-ag-line-number={index}
        header={<FormattedMessage id="ui-agreements.agreementLines.lineTitle" values={{ number: index + 1 }} />}
        onDelete={this.props.onDelete}
      >
        <React.Fragment>
          {
            (resource.id || resource.reference) ?
              this.renderLineResource() :
              this.renderLineSelector()
          }
        </React.Fragment>
      </EditCard>
    );
  }
}
