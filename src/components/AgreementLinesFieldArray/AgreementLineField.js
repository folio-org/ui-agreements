import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { Col, Datepicker, KeyValue, Row } from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';

import BasketSelector from '../BasketSelector';
import CoverageStatement from '../CoverageStatements';
import EResourceLink from '../EResourceLink';
import EResourceCount from '../EResourceCount';
import EResourceProvider from '../EResourceProvider';
import EResourceType from '../EResourceType';
import { isExternal, isPackage } from '../utilities';

import CustomCoverageFieldArray from './CustomCoverageFieldArray';
import POLinesFieldArray from './POLinesFieldArray';

export default class AgreementLineField extends React.Component {
  static propTypes = {
    basket: PropTypes.arrayOf(PropTypes.object),
    index: PropTypes.number,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onDelete: PropTypes.func,
    onResourceSelected: PropTypes.func,
    poLines: PropTypes.arrayOf(PropTypes.object),
    resource: PropTypes.object,
  }

  static defaultProps = {
    resource: {},
  }

  validateDateOrder = (value, allValues, meta) => {
    if (value && meta) {
      let activeFrom;
      let activeTo;

      if (meta.name.indexOf('activeFrom') >= 0) {
        activeFrom = new Date(value);
        activeTo = new Date(get(allValues, meta.name.replace('activeFrom', 'activeTo')));
      } else if (meta.name.indexOf('endDate') >= 0) {
        activeFrom = new Date(get(allValues, meta.name.replace('activeTo', 'activeFrom')));
        activeTo = new Date(value);
      } else {
        return undefined;
      }

      if (activeFrom >= activeTo) {
        return (
          <div data-test-error-end-date-too-early>
            <FormattedMessage id="ui-agreements.errors.endDateGreaterThanStartDate" />
          </div>
        );
      }
    }

    return undefined;
  }

  renderLineName = (resource) => {
    const dereferencedResource = get(resource, '_object.pti.titleInstance', resource);
    return <EResourceLink eresource={dereferencedResource} />;
  }

  renderLineType = (resource) => {
    return <EResourceType resource={resource} />;
  }

  renderLineTitles = (resource) => {
    return <EResourceCount resource={resource} />;
  }

  renderLineProvider = (resource) => {
    return <EResourceProvider resource={resource} />;
  }

  renderCoverage = (resource) => {
    const coverage = get(resource, 'coverage');
    return <CoverageStatement statements={coverage} />;
  }

  renderPOLinesFieldArray = () => {
    const {
      index,
      input: { name },
      poLines,
    } = this.props;

    return (
      <FieldArray
        agreementLineIndex={index}
        component={POLinesFieldArray}
        name={`${name}.poLines`}
        poLines={poLines}
      />
    );
  }

  renderCustomCoverageFieldArray = () => {
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
    const { resource = {}, index, input: { name } } = this.props;

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
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-agreements.eresources.defaultCoverage" />}>
              <div data-test-ag-line-coverage>{this.renderCoverage(resource)}</div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              id={`agreement-line-${index}-active-from`}
              label={<FormattedMessage id="ui-agreements.eresources.activeFrom" />}
              name={`${name}.activeFrom`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
              validate={this.validateDateOrder}
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              id={`agreement-line-${index}-active-to`}
              label={<FormattedMessage id="ui-agreements.eresources.activeTo" />}
              name={`${name}.activeTo`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
              validate={this.validateDateOrder}
            />
          </Col>
        </Row>
        {this.renderPOLinesFieldArray()}
        {this.renderCustomCoverageFieldArray()}
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

  render() {
    const { index, resource = {} } = this.props;

    return (
      <EditCard
        data-test-ag-line-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-agreements.agreementLines.removeLine" />}
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
