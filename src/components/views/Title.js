import React from 'react';
import PropTypes from 'prop-types';

import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  AcquisitionOptions,
  Agreements,
  TitleInfo,
} from '../EResourceSections';

import { urls } from '../utilities';

export default class Title extends React.Component {
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
    const { data } = this.props;

    return (
      <div id="package">
        <TitleInfo data={data} />
        <Agreements data={data} />
        <NotesSmartAccordion
          {...this.getSectionProps('notes')}
          domainName="agreements"
          entityId={data.eresource.id}
          entityName={data.eresource.name}
          entityType="eresource"
          pathToNoteCreate={urls.noteCreate()}
          pathToNoteDetails={urls.notes()}
        />
        <AcquisitionOptions data={data} />
      </div>
    );
  }
}
