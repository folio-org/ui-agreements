import { createRef, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage, useIntl } from 'react-intl';
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

import { Link } from 'react-router-dom';

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
  resource = {
    displaydescription:
      'Observation of groundworks involved with structural repair, including underpinning. No archaeological deposits were observed.',
    displayname: 'Watching Brief at Spring Hill',
    graph_id: 'b9e0701e-5463-11e9-b5f5-000d3ab1e588',
    legacyid: "{'en': {'direction': 'ltr', 'value': 'E5522'}}",
    map_popup:
      'Observation of groundworks involved with structural repair, including underpinning. No archaeological deposits were observed.',
    resource: {
      'Activity Descriptions': [
        {
          'Activity Description':
            'Observation of groundworks involved with structural repair, including underpinning. No archaeological deposits were observed.',
          'Activity Description Type': {
            '@value': 'Summary',
            'Activity Description Metatype': '',
          },
        },
      ],
      'Activity Names': [
        {
          'Activity Name': 'Watching Brief at Spring Hill',
          'Activity Name Currency': {
            '@value': '',
            'Activity Name Currency Metatype': '',
          },
          'Activity Name Type': {
            '@value': 'Primary',
            'Activity Name Metatype': '',
          },
          'Activity Name Use Type': {
            '@value': '',
            'Activity Name Use Metatype': '',
          },
        },
      ],
      'Activity Timespan': {
        'Activity Date Qualifier': {
          '@value': '',
          'Activity Date Qualifier Metatype': '',
        },
        'Activity End Date': '2000-09-18',
        'Activity Start Date': '2000-09-18',
        'Display Date': null,
      },
      'Activity Type': {
        '@value': 'Watching Brief',
        'Activity Metatype': '',
      },
      'Associated Monuments and Areas': 'Castle Mount, Spring Hill',
      'Bibliographic Source Citation': [
        {
          '@value':
            'Voluntary Observations of interventions by staff of the Heritage Team, Lincoln City Council.',
          Figures: {
            'Figs.': null,
            'Figures Type': {
              '@value': '',
              'Figures Metatype': '',
            },
          },
          Pages: {
            'Page(s)': null,
            'Pages Type': {
              '@value': '',
              'Pages Metatype': '',
            },
          },
          Plates: {
            'Plate(s)': null,
            'Plates Type': {
              '@value': '',
              'Plates metatype': '',
            },
          },
          'Source Comment': {
            Comment: null,
            'Source Comment Type': {
              '@value': '',
              'Source Comment Metatype': '',
            },
          },
          'Source Number': {
            'Source Number Type': {
              '@value': '',
              'Source Number Metatype': '',
            },
            'Source Number Value': null,
          },
        },
      ],
      'Location Data': {
        Geometry: {
          'Feature Shape': {
            '@value': '',
            'Feature Shape Metatype': '',
          },
          'Geospatial Coordinates':
            "{'type': 'FeatureCollection', 'features': [{'id': '9fb04cd3-e6ca-4a42-b8bd-667c27e758b5', 'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [-0.542554016810026, 53.2337139891952]}, 'properties': {}}]}",
        },
      },
      'System Reference Numbers': {
        LegacyID: {
          'Legacy ID': 'E5522',
          'Legacy ID Type': {
            '@value': '',
            'Legacy ID Metatype': '',
          },
        },
        PrimaryReferenceNumber: {
          'Primary Reference Number': '1131',
          'Primary Reference Number Type': {
            '@value': '',
            'Primary Reference Number Metatype': '',
          },
        },
        UUID: {
          ResourceID: '000543e8-bfea-40b3-8325-010981f2369e',
          'ResourceID Type': {
            '@value': '',
            'ResourceID Metatype': '',
          },
        },
      },
    },
    primaryreferenceid: '1131',
    resourceid: '000543e8-bfea-40b3-8325-010981f2369e',
    resourceinstanceid: '000543e8-bfea-40b3-8325-010981f2369e',
  };
  const intl = useIntl();
  const accordionStatusRef = createRef();

  const applyJsonPath = (expression) =>
    JSONPath({ path: expression, json: resource }) || [];

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

  // treat '', null/false, empty arrays as "empty"
  const hasVisualContent = (node) => {
    if (node == null || node === false) return false;
    if (typeof node === 'string') return node.trim() !== '';
    if (Array.isArray(node)) return node.some(hasVisualContent);

    if (isValidElement(node)) {
      if ('children' in (node.props || {}))
        return hasVisualContent(node.props.children);
      return true;
    }
    return true;
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
            <a href="https://arcade-test.lincoln.gov.uk/report/000543e8-bfea-40b3-8325-010981f2369e">
              {renderValue(value.value)}
            </a>
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
      default:
        return '';
    }
  };

  const applyRenderStrategy = (strategy, collapsable = false, name = '') => {
    switch (strategy.type) {
      case 'sections':
        return strategy.values?.map((section) => (
          <div key={section.name}>
            {applyRenderStrategy(
              section.renderStrategy,
              section?.collapsable,
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
                    section.name
                  )}
                </div>
              ))}
            </AccordionSet>
          </AccordionStatus>
        );
      case 'rows': {
        const rows = (strategy.values || []).reduce((acc, val) => {
          const child = renderValue(val);
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
