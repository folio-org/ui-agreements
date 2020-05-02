import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import { resourceTypes, resourceClasses } from '../../constants';
import { getResourceIdentifier } from '../utilities';
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

  renderIdentifier(type, titleInstance, width = 3) {
    const identifier = getResourceIdentifier(titleInstance, type);

    return (
      <Col xs={width}>
        <KeyValue
          label={<FormattedMessage id={`ui-agreements.identifier.${type}`} />}
        >
          <div {...{ [`data-test-${type}`]: true }}>{identifier || <NoValue />}</div>
        </KeyValue>
      </Col>
    );
  }

  render() {
    const { data: { eresource } } = this.props;

    const titleInstance = (eresource.class === resourceClasses.TITLEINSTANCE) ?
      eresource
      :
      eresource?.pti?.titleInstance;

    const { label } = titleInstance?.type;

    let ResourceInfoComponent;
    if (label === resourceTypes.MONOGRAPH || label === resourceTypes.BOOK) {
      ResourceInfoComponent = MonographResourceInfo;
    } else {
      ResourceInfoComponent = SerialResourceInfo;
    }

    return (
      <ResourceInfoComponent
        renderIdentifier={(type) => this.renderIdentifier(type, titleInstance)}
        titleInstance={titleInstance}
      />
    );
  }
}
