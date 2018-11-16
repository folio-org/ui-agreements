import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';

import {
  PackageInfo,
  PackageResources,
} from './Sections';

class ViewPackage extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
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
        resources: true,
      }
    };
  }

  getSectionProps() {
    return {
      match: this.props.match,
      eresource: this.props.eresource,
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

  render() {
    const sectionProps = this.getSectionProps();

    return (
      <AccordionSet>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
          </Col>
        </Row>
        <PackageInfo
          id="info"
          open={this.state.sections.info}
          {...sectionProps}
        />
        <PackageResources
          id="resources"
          open={this.state.sections.resources}
          {...sectionProps}
        />
      </AccordionSet>
    );
  }
}

export default ViewPackage;
