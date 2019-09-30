import React from 'react';
import PropTypes from 'prop-types';

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
  }

  state = {
    sections: {
      notes: false,
    },
  }

  getSectionProps = (id) => {
    const { data, handlers } = this.props;

    return {
      eresource: data.eresource,
      data,
      id,
      handlers,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
    };
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
      <div id="package">
        <PackageInfo data={data} />
        <Agreements data={data} />
        <PackageContents
          data={data}
          onClickFilterButton={handlers.onClickFilterButton}
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
      </div>
    );
  }
}
