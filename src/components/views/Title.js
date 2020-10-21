import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  HasCommand,
  Headline,
  Row,
} from '@folio/stripes/components';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  AcquisitionOptions,
  Agreements,
} from '../EResourceSections';

import TitleCardInfo from '../TitleCard/TitleCardInfo';
import { urls } from '../utilities';

export default class Title extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    handlers: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();
  }

  expandAllSections = (e) => {
    e.preventDefault();
    const { state, setStatus } = this.accordionStatusRef.current;
    // eslint-disable-next-line no-undef
    setStatus(() => _.mapValues(state, () => true));
  }

  collapseAllSections = (e) => {
    e.preventDefault();
    const { state, setStatus } = this.accordionStatusRef.current;
    // eslint-disable-next-line no-undef
    setStatus(() => _.mapValues(state, () => false));
  }

  getSectionProps = (id) => {
    const { data, handlers } = this.props;

    return {
      eresource: data.eresource,
      data,
      id,
      handlers,
    };
  }

  getInitialAccordionsState = () => {
    return {
      acquisitionOptions: false,
      eresourceAgreements: false,
      notes: false,
    };
  }

  renderTitleInfo = (eresource) => (
    <div id="title-info">
      <Headline
        margin="small"
        size="xx-large"
        tag="h2"
      >
        {eresource.name}
      </Headline>
      <TitleCardInfo {...this.getSectionProps('info')} title={eresource} />
    </div>
  );

  render() {
    const { data } = this.props;

    const shortcuts = [
      {
        name: 'expandAllSections',
        handler: this.expandAllSections,
      },
      {
        name: 'collapseAllSections',
        handler: this.collapseAllSections
      }
    ];

    return (
      <HasCommand
        commands={shortcuts}
        isWithinScope
        scope={document.body}
      >
        <div id="eresource-title">
          {this.renderTitleInfo(data.eresource)}
          <AccordionStatus ref={this.accordionStatusRef}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton />
              </Col>
            </Row>
            <AccordionSet initialStatus={this.getInitialAccordionsState()}>
              <Agreements
                {...this.getSectionProps('eresourceAgreements')}
                isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.noAgreementsEresource" />}
                visibleColumns={['name', 'type', 'startDate', 'endDate', 'eresource', 'acqMethod', 'coverage', 'isCustomCoverage']}
              />
              <AcquisitionOptions {...this.getSectionProps('acquisitionOptions')} />
              <NotesSmartAccordion
                {...this.getSectionProps('notes')}
                domainName="agreements"
                entityId={data.eresource.id}
                entityName={data.eresource.name}
                entityType="eresource"
                pathToNoteCreate={urls.noteCreate()}
                pathToNoteDetails={urls.notes()}
              />
            </AccordionSet>
          </AccordionStatus>

        </div>
      </HasCommand>
    );
  }
}
