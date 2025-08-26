import { createRef } from 'react';
import PropTypes from 'prop-types';
import { JSONPath } from 'jsonpath-plus';
import { FormattedMessage } from 'react-intl';
import { AppIcon } from '@folio/stripes/core';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  collapseAllSections,
  Col,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Headline,
  Icon,
  KeyValue,
  LoadingPane,
  MetaSection,
  MultiColumnList,
  NoValue,
  Pane,
  Row,
  PaneMenu,
} from '@folio/stripes/components';

import { handlebarsCompile, renderPublicationDates } from '../../utilities';
import getResultsDisplayConfig from '../../../routes/utilities/getResultsDisplayConfig';

const PANE_DEFAULT_WIDTH = '50%';

const propTypes = {
  config: PropTypes.shape({}).isRequired,
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
  config,
  resource,
  onClose,
  queryProps: { isLoading },
}) => {
  const accordionStatusRef = createRef();

  const displayConfig = config.configuration.view.display;
  const applyJsonPath = (expression, res = resource) => JSONPath({ path: expression, json: res }) || [];

  const renderValue = (value, res = resource) => {
    switch (value.type) {
      case 'access':
        if (value.accessType === 'JSONPath') {
          const result = applyJsonPath(value.expression, res);
          return result.length > 0 ? result.join(', ') : <NoValue />;
        }
        return '';
      case 'keyValue':
        return <KeyValue
          label={<FormattedMessage id={`ui-agreements.remoteKb.${value.name}`} />}
          value={renderValue(value.value)}
        />;
      case 'row': {
        const colSize = value.colCount ? Math.floor(12 / Number(value.colCount)) : 12;
        return (
          <>
            {value.values.map((val, index) => (
              <Col key={index} xs={colSize}>
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
        // console.log('displayDates value', value.value);
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
          return result.length > 0 ? result.map(obj => template(obj)) : <NoValue />;
        } else {
          return '';
        }
      case 'table': {
        const { formatter } = getResultsDisplayConfig(value.columns);
        const resourceData = applyJsonPath(value.resource?.expression);

        return (
          resourceData.length > 0 ?
            <MultiColumnList
              // columnMapping={{ name: <FormattedMessage id="ui-agreements.remoteKb.${value.columns." /> }}
              columnMapping={value.columns.reduce((acc, col) => {
                acc[col.name] = <FormattedMessage id={`ui-agreements.remoteKb.${col.name}`} />;
                return acc;
              }, {})}
              contentData={resourceData}
              // id="alternate-resource-names-list"
              formatter={formatter}
              visibleColumns={(value?.columns).map(c => c.name)}
            />
            : ''
        );
      }
      default:
        return '';
    }
  };

  const applyRenderStrategy = (strategy) => {
    console.log('applyRenderStrategy', strategy);
    switch (strategy.type) {
      case 'sections':
        return (
          strategy.values?.map((section, index) => (section.collapsable ? (
            <AccordionStatus key={index} ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              {applyRenderStrategy(section.renderStrategy)}
              <AccordionSet />
            </AccordionStatus>
          ) : (
            applyRenderStrategy(section.renderStrategy)
          )))
        );
      case 'rows':
        return (
          strategy.values?.map((val, index) => (
            <Row key={index}>
              {renderValue(val)}
            </Row>
          ))
        );
      default:
        return '';
    }
  };

  const shortcuts = [
    // { name: 'edit', handler: () => handleEdit() },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  const renderActionMenu = () => {
    const buttons = [];
    // if (stripes.hasPerm('ui-oa.publicationRequest.edit')) {
    //   buttons.push(
    //     <Button
    //       buttonStyle="dropdownItem"
    //       id="clickable-dropdown-edit-remote-kb-title"
    //       onClick={handleEdit}
    //     >
    //       <Icon icon="edit">
    //         <FormattedMessage id="ui-oa.publicationRequest.edit" />
    //       </Icon>
    //     </Button>
    //   );
    // }
    return buttons.length ? buttons : null;
  };

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
        actionMenu={renderActionMenu}
        appIcon={<AppIcon app="agreements" iconKey={displayConfig.icon} size="small" />}
        defaultWidth={PANE_DEFAULT_WIDTH}
        dismissible
        onClose={onClose}
        paneTitle={renderValue(displayConfig.title)}
      >
        {/* <MetaSection
          contentId="remoteKbResourceMetaContent"
          createdDate={resource?.createdBy}
          hideSource
          lastUpdatedDate={resource?.lastUpdated}
        /> */}

        {applyRenderStrategy(displayConfig.renderStrategy)}
      </Pane>
    </HasCommand>
  );
};

RemoteKbResource.propTypes = propTypes;

export default RemoteKbResource;
