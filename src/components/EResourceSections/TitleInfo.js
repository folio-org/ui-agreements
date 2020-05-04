import React from 'react';
import PropTypes from 'prop-types';
import { resourceTypes, resourceClasses } from '../../constants';
import MonographResourceInfo from './MonographResourceInfo';
import SerialResourceInfo from './SerialResourceInfo';

export default class TitleInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        class: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.shape({
          label: PropTypes.string,
        }),
        publisher: PropTypes.shape({
          label: PropTypes.string,
        }),
      })
    }).isRequired,
  }

  render() {
    const { data: { eresource } } = this.props;

    const titleInstance = (eresource.class === resourceClasses.TITLEINSTANCE) ?
      eresource
      :
      eresource?.pti?.titleInstance;

    const { label } = titleInstance?.type;

    const ResourceInfoComponent = (
      label === resourceTypes.MONOGRAPH || label === resourceTypes.BOOK
    ) ? MonographResourceInfo : SerialResourceInfo;

    return (
      <ResourceInfoComponent
        titleInstance={titleInstance}
      />
    );
  }
}
