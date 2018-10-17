import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  Pane,
  Row,
} from '@folio/stripes/components';

import {
  EResourceInfo,
  AcquisitionOptions,
} from './Sections';

class ViewEResource extends React.Component {
  static manifest = Object.freeze({
    selectedEResource: {
      type: 'okapi',
      path: 'erm/resource/:{id}',
    },
    query: {},
  });

  static propTypes = {
    match: PropTypes.object,
    onClose: PropTypes.func,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      sections: {
        info: true,
        agreements: false,
        acquisitionOptions: false,
      }
    };
  }

  getEResource() {
    return get(this.props.resources.selectedEResource, ['records', 0], undefined);
  }


  getSectionProps() {
    return {
      match: this.props.match,
      eresource: this.getEResource(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
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

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
  }

  renderLoadingPane() {
    return (
      <Pane
        id="pane-view-eresource"
        defaultWidth="55%"
        paneTitle="Loading..."
        dismissible
        onClose={this.props.onClose}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="100px" />
        </Layout>
      </Pane>
    );
  }

  render() {
    const resource = this.getEResource();
    if (!resource) return this.renderLoadingPane();

    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-eresource"
        defaultWidth="55%"
        paneTitle={resource.name}
        dismissible
        onClose={this.props.onClose}
      >
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
            </Col>
          </Row>
          <EResourceInfo
            id="info"
            open={this.state.sections.info}
            {...sectionProps}
          />
          <AcquisitionOptions
            id="acquisitionOptions"
            open={this.state.sections.acquisitionOptions}
            {...sectionProps}
          />
        </AccordionSet>
      </Pane>
    );
  }
}

export default ViewEResource;
