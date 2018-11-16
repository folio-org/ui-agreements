import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';

import {
  TitleInfo,
  AcquisitionOptions,
} from './Sections';

class ViewTitle extends React.Component {
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
        acquisitionOptions: true,
      }
    };

    this.connectedAcquisitionOptions = props.stripes.connect(AcquisitionOptions);
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
        <TitleInfo
          id="info"
          open={this.state.sections.info}
          {...sectionProps}
        />
        <this.connectedAcquisitionOptions
          id="acquisitionOptions"
          key={`acqOptions-${eresource.id}`} // Force a remount when changing which resource we're viewing
          open={this.state.sections.acquisitionOptions}
          {...sectionProps}
        />
      </AccordionSet>
    );
  }
}

export default ViewTitle;
