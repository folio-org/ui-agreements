import { createRef } from 'react';
import PropTypes from 'prop-types';
import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import { AppIcon } from '@folio/stripes/core';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  collapseAllSections,
  Col,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Headline,
  KeyValue,
  LoadingPane,
  MetaSection,
  MultiColumnList,
  NoValue,
  Pane,
  Row,
} from '@folio/stripes/components';

import { handlebarsCompile, renderPublicationDates, stableKeyFrom } from '../../utilities';
import getResultsDisplayConfig from '../../../routes/utilities/getResultsDisplayConfig';

const PANE_DEFAULT_WIDTH = '50%';

const propTypes = {
  displayConfig: PropTypes.shape({
    icon: PropTypes.string,
    title: PropTypes.objectOf(PropTypes.string),
    renderStrategy: PropTypes.shape({}),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  resource: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({}))
  ]),
  queryProps: PropTypes.shape({
    isLoading: PropTypes.bool,
  }),
};

const RemoteKbResource = ({
  displayConfig,
  resource,
  onClose,
  queryProps: { isLoading },
}) => {
  const accordionStatusRef = createRef();

  const applyJsonPath = (expression) => JSONPath({ path: expression, json: resource }) || [];
  /*
    we need the initial status for each accordion that is collapsable
    maybe later we use a config entry for the boolean value instead of false as default
  */
  const getInitialAccordionsState = () => {
    const initialStatus = {};
    displayConfig.renderStrategy.values
      ?.filter(section => section.collapsable)
      .forEach(section => {
        initialStatus[section.name] = false;
      });

    return initialStatus;
  };

  const renderValue = (value) => {
    switch (value.type) {
      case 'access':
        if (value.accessType === 'JSONPath') {
          const result = applyJsonPath(value.expression);
          return result.length > 0 ? result.join(', ') : <NoValue />;
        }
        return '';
      case 'keyValue':
        return <KeyValue
          label={<FormattedMessage id={`ui-agreements.remoteKb.${value.name}`} />}
          value={renderValue(value.value)}
        />;
      case 'row': {
        const colSize = value.colCount ? (12 / Number(value.colCount)) : 12;
        return (
          <>
            {value.values.map((val) => (
              <Col key={stableKeyFrom(val)} xs={colSize}>
                {renderValue(val)}
              </Col>
            ))}
          </>
        );
      }
      case 'metadata':
        return <MetaSection
          contentId="remoteKbResourceMetaContent"
          createdDate={renderValue(value.createdBy)}
          hideSource
          lastUpdatedDate={renderValue(value.lastUpdated)}
        />;
      case 'heading':
        return (
          <Headline
            size="xx-large"
            tag="h2"
          >
            {renderValue(value.value)}
          </Headline>
        );
      case 'displayDates': {
        const combinedData = {};
        value.value?.forEach(({ key, expression }) => {
          const jsonResult = applyJsonPath(expression);
          if (key && jsonResult?.length > 0) {
            combinedData[key] = jsonResult[0];
          }
        });
        const result = renderPublicationDates(combinedData);
        return result || <NoValue />;
      }
      case 'handlebars':
        if (value.value?.type === 'access' && value.value?.accessType === 'JSONPath') {
          const result = applyJsonPath(value.value?.expression);
          const template = handlebarsCompile(value.templateString);
          return result.length > 0 ? result.map(obj => template(obj)).join(', ') : <NoValue />;
        } else {
          return '';
        }
      case 'table': {
        const { formatter } = getResultsDisplayConfig(value.columns);
        // MCL expects array of objects
        const raw = applyJsonPath(value.resource?.expression);
        const nameKey = value.columns[0].name;
        const resourceData = Array.isArray(raw) && raw.length > 0 && typeof raw[0] !== 'object'
          ? raw.map(v => ({ [nameKey]: v }))   // only wrap primitives
          : raw;                           // leave objects alone

        return (
          resourceData.length > 0 ?
            <MultiColumnList
              columnMapping={value.columns.reduce((acc, col) => {
                acc[col.name] = <FormattedMessage id={`ui-agreements.remoteKb.${col.name}`} />;
                return acc;
              }, {})}
              contentData={resourceData}
              formatter={formatter}
              visibleColumns={(value?.columns || []).map(c => c.name)}
            />
            : ''
        );
      }
      default:
        return '';
    }
  };

  const applyRenderStrategy = (strategy, collapsable = false, name = '') => {
    switch (strategy.type) {
      case 'sections':
        return strategy.values?.map((section) => (
          applyRenderStrategy(section.renderStrategy, section?.collapsable, section.name)
        ));
      case 'accordionset':
        return (
          <>
            <AccordionStatus ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              <AccordionSet initialStatus={getInitialAccordionsState()}>
                {strategy.values?.map((section) => (
                  applyRenderStrategy(section.renderStrategy, section?.collapsable, section.name)
                ))}
              </AccordionSet>
            </AccordionStatus>
          </>
        );
      case 'rows': {
        const rows = strategy.values?.map((val) => (
          <Row key={stableKeyFrom(val)}>
            {renderValue(val)}
          </Row>
        ));

        return collapsable ? (
          <Accordion
            id={`${name}`}
            label={<FormattedMessage id={`ui-agreements.remoteKb.${name}`} />}
          >
            {rows}
          </Accordion>
        ) : (
          <>{rows}</>
        );
      }
      default:
        return null;
    }
  };

  const shortcuts = [
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  if (isLoading) {
    return (
      <LoadingPane
        defaultWidth={PANE_DEFAULT_WIDTH}
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        appIcon={<AppIcon app="agreements" iconKey={displayConfig.icon} size="small" />}
        defaultWidth={PANE_DEFAULT_WIDTH}
        dismissible
        onClose={onClose}
        paneTitle={renderValue(displayConfig.title)}
      >
        {applyRenderStrategy(displayConfig.renderStrategy)}
      </Pane>
    </HasCommand>
  );
};

RemoteKbResource.propTypes = propTypes;

export default RemoteKbResource;
