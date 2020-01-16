import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  Agreements,
  PackageContents,
  PackageInfo,
} from '../EResourceSections';

import { urls } from '../utilities';

export default class Package extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    handlers: PropTypes.object,
    isPending: PropTypes.bool,
  }

  state = {
    sections: {
      eresourceAgreements: true,
      info: true,
      notes: false,
      packageContents: true,
    },
  }

  getSectionProps = (id) => {
    const { data, handlers, isPending } = this.props;

    return {
      eresource: data.eresource,
      data,
      id,
      handlers,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
      isPending,
    };
  }

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  render() {
    const { data, handlers } = this.props;

    return (
      <div id="eresource-package">
        <PackageInfo {...this.getSectionProps('info')} />
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={this.state.sections}
                id="clickable-expand-all"
                onToggle={this.handleAllSectionsToggle}
              />
            </Col>
          </Row>
          <Agreements {...this.getSectionProps('eresourceAgreements')} />
          <PackageContents
            {...this.getSectionProps('packageContents')}
            onFilterPackageContents={handlers.onFilterPackageContents}
            onNeedMorePackageContents={handlers.onNeedMorePackageContents}
          />
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
      </div>
    );
  }
}
