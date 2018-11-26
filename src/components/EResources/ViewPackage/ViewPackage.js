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

    this.connectedPackageResources = props.stripes.connect(PackageResources);
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
    const { eresource } = this.props;
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
        <this.connectedPackageResources
          id="resources"
          key={`agreements-${eresource.id}`} // Force a remount when changing which eresource we're viewing
          open={this.state.sections.resources}
          {...sectionProps}
        />
      </AccordionSet>
    );
  }
}

export default ViewPackage;
