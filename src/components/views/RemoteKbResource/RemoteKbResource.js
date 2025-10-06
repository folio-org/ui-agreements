import { createRef, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';
import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppIcon, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Badge,
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

import { Registry } from '@folio/handler-stripes-registry';

import {
  handlebarsCompile,
  renderPublicationDates,
  stableKeyFrom,
} from '../../utilities';

import getResultsDisplayConfig from '../../../routes/utilities/getResultsDisplayConfig';

const PANE_DEFAULT_WIDTH = '50%';

const propTypes = {
  displayConfig: PropTypes.shape({
    icon: PropTypes.string,
    title: PropTypes.objectOf(PropTypes.string),
    renderStrategy: PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  resource: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
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
  const intl = useIntl();
  const accordionStatusRef = createRef();
  const [badges, setBadges] = useState({});
  const ky = useOkapiKy();

  const { data: { records: tipps = [] } = {} } = useQuery(
    ['GOKB', 'fetchTIPPS', resource?.uuid],
    () => ky
      .get(
        `https://gokbt.gbv.de/gokb/api/find?componentType=TIPP&title=${resource?.uuid}`
      )
      .json()
  );

  const applyJsonPath = (expression) => JSONPath({ path: expression, json: resource }) || [];

  /*
    we need the initial status for each accordion
    maybe later we use a config entry for the boolean value instead of false as default
  */
  const initialAccordionsState =
    displayConfig.renderStrategy?.values
      ?.find((s) => s.renderStrategy?.type === 'accordionset')
      ?.renderStrategy?.values?.filter((s) => s.collapsable)
      ?.reduce((acc, s) => {
        acc[s.name] = false;
        return acc;
      }, {}) || {};

  const setBadgeCount = (sectionName) => (count) => {
    setBadges((prev) => {
      if (count == null) {
        const { [sectionName]: _omit, ...rest } = prev;
        return rest;
      }
      if (prev[sectionName] === count) return prev;
      return { ...prev, [sectionName]: count };
    });
  };

  const renderBadge = (name) => {
    const count = badges[name] ?? 0;
    return <Badge>{count}</Badge>;
  };

  // treat '', null/false, empty arrays as "empty"
  const hasVisualContent = (node) => {
    if (node == null || node === false) return false;
    if (typeof node === 'string') return node.trim() !== '';
    if (Array.isArray(node)) return node.some(hasVisualContent);

    if (isValidElement(node)) {
      if ('children' in (node.props || {})) return hasVisualContent(node.props.children);
      return true;
    }
    return true;
  };

  const renderValue = (value, sectionName) => {
    switch (value.type) {
      case 'access':
        if (value.accessType === 'JSONPath') {
          const result = applyJsonPath(value.expression);
          return result.length > 0 ? result.join(', ') : <NoValue />;
        }
        return '';
      case 'keyValue':
        return (
          <KeyValue
            label={
              <FormattedMessage id={`ui-agreements.remoteKb.${value.name}`} />
            }
            value={renderValue(value.value)}
          />
        );
      case 'row': {
        const colSize = value.colCount ? 12 / Number(value.colCount) : 12;
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
        return (
          <MetaSection
            contentId="remoteKbResourceMetaContent"
            createdDate={renderValue(value.createdDate)}
            hideSource
            lastUpdatedDate={renderValue(value.lastUpdatedDate)}
          />
        );
      case 'heading':
        return (
          <Headline size="xx-large" tag="h2">
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
        if (
          value.value?.type === 'access' &&
          value.value?.accessType === 'JSONPath'
        ) {
          const result = applyJsonPath(value.value?.expression);
          const template = handlebarsCompile(value.templateString);
          return result.length > 0 ? (
            result.map((obj) => template(obj)).join(', ')
          ) : (
            <NoValue />
          );
        } else {
          return '';
        }
      case 'table': {
        const { formatter } = getResultsDisplayConfig(value.columns);
        // MCL expects array of objects
        const raw = applyJsonPath(value.resource?.expression);
        const nameKey = value.columns[0].name;
        const resourceData =
          Array.isArray(raw) && raw.length > 0 && typeof raw[0] !== 'object'
            ? raw.map((v) => ({ [nameKey]: v })) // only wrap primitives
            : raw; // leave objects alone

        return resourceData.length > 0 ? (
          <MultiColumnList
            columnMapping={value.columns.reduce((acc, col) => {
              acc[col.name] = (
                <FormattedMessage id={`ui-agreements.remoteKb.${col.name}`} />
              );
              return acc;
            }, {})}
            contentData={resourceData}
            formatter={formatter}
            visibleColumns={(value?.columns || []).map((c) => c.name)}
          />
        ) : (
          ''
        );
      }
      case 'registry': {
        const registryResource = Registry.getResource(value.registryResource);
        const registryRenderFunction =
          registryResource?.getRenderFunction(value.registryRenderFunction) ??
          null;

        const props = (value.props || [])?.reduce((acc, p) => {
          if (p.value?.type === 'access') {
            acc[p.name] = renderValue(p.value);
            return acc;
          }
          if (p.value?.type === 'tipps') {
            acc[p.name] = tipps;
            return acc;
          }
          return null;
        }, {});

        props.setBadgeCount = setBadgeCount(sectionName);

        return registryRenderFunction
          ? value?.props
            ? registryRenderFunction(props)
            : null
          : null;
      }
      default:
        return '';
    }
  };

  const applyRenderStrategy = (
    strategy,
    collapsable = false,
    badge = false,
    name = ''
  ) => {
    switch (strategy.type) {
      case 'sections':
        return strategy.values?.map((section) => (
          <div key={section.name}>
            {applyRenderStrategy(
              section.renderStrategy,
              section?.collapsable,
              section?.badge,
              section.name
            )}
          </div>
        ));
      case 'accordionset':
        return (
          <AccordionStatus ref={accordionStatusRef}>
            {Object.keys(initialAccordionsState).length > 1 && (
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
            )}
            <AccordionSet initialStatus={initialAccordionsState}>
              {strategy.values?.map((section) => (
                <div key={section.name}>
                  {applyRenderStrategy(
                    section.renderStrategy,
                    section?.collapsable,
                    section?.badge,
                    section.name
                  )}
                </div>
              ))}
            </AccordionSet>
          </AccordionStatus>
        );
      case 'rows': {
        const rows = (strategy.values || []).reduce((acc, val) => {
          const child = renderValue(val, name);
          if (!collapsable || hasVisualContent(child)) {
            acc.push(<Row key={stableKeyFrom(val)}>{child}</Row>);
          }
          return acc;
        }, []);

        if (collapsable) {
          const accordionTitle = intl.formatMessage({
            id: `ui-agreements.remoteKb.${name}`,
          });
          const accordion = accordionTitle.toLowerCase();

          return (
            <Accordion
              key={name}
              closedByDefault
              displayWhenClosed={badge ? renderBadge(name) : null}
              displayWhenOpen={badge ? renderBadge(name) : null}
              id={name}
              label={accordionTitle}
            >
              {rows.length ? (
                rows
              ) : (
                <FormattedMessage
                  id="ui-agreements.remoteKb.noAccordionContent"
                  values={{ accordion }}
                />
              )}
            </Accordion>
          );
        }
        return <>{rows}</>;
      }
      default:
        return '';
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
        appIcon={
          <AppIcon app="agreements" iconKey={displayConfig.icon} size="small" />
        }
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
