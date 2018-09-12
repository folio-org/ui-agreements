import React from 'react';
import PropTypes from 'prop-types';

import Button from '@folio/stripes-components/lib/Button';
import SegmentedControl from '@folio/stripes-components/lib/SegmentedControl';

import css from './Tabs.css'

export default class Tabs extends React.Component {
  static propTypes = {
    tab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    parentMutator: PropTypes.object,
  };

  state = {
    tab: '',
  };

  componentDidMount() {
    this.setTab();
  }

  setTab = () => {
    const { tab } = this.props;
    if (!tab) return;
    this.setState( { tab })
  }

  handleActivate = ({ id }) => {
    this.setState({ tab: id });
    this.props.parentMutator.query.update({
      _path: `/erm/${id}`,
      layer: null,
      query: '',
      filters: '',
      sort: '',
    });
  }

  render() {
    return (
      <div className={css.SegControl}>
        <SegmentedControl activeId={this.state.tab} onActivate={this.handleActivate}>
          <Button id="dashboard">Dashboard</Button>
          <Button id="agreements">Agreements</Button>
          <Button id="kbs">KBs</Button>
          <Button id="titles">Titles</Button>
        </SegmentedControl>
      </div>
    );
  }
}