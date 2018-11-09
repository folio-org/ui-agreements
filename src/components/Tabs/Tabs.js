import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, SegmentedControl } from '@folio/stripes/components';

import css from './Tabs.css';

class Tabs extends React.Component {
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

  static getDerivedStateFromProps(newProps, state) {
    if (newProps.tab !== state.tab) {
      return { tab: newProps.tab };
    }

    return null;
  }

  componentDidMount() {
    this.setTab();
  }

  setTab = () => {
    const { tab } = this.props;
    if (!tab) return;
    this.setState({ tab });
  }

  handleActivate = ({ id }) => {
    this.setState({ tab: id });
    this.props.parentMutator.query.replace({
      _path: `/erm/${id}`,
      addFromBasket: null,
      layer: null,
    });
    this.props.parentMutator.resultCount.replace(1);
  }

  render() {
    return (
      <div className={css.SegControl}>
        <SegmentedControl activeId={this.state.tab} onActivate={this.handleActivate}>
          <Button id="dashboard">
            <FormattedMessage id="ui-agreements.tabs.dashboard" />
          </Button>
          <Button id="agreements">
            <FormattedMessage id="ui-agreements.tabs.agreements" />
          </Button>
          <Button id="eresources">
            <FormattedMessage id="ui-agreements.tabs.eresources" />
          </Button>
        </SegmentedControl>
      </div>
    );
  }
}

export default Tabs;
