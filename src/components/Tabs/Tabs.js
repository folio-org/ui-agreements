import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, ButtonGroup } from '@folio/stripes/components';

import IfEResourcesEnabled from '../IfEResourcesEnabled';
import css from './Tabs.css';

class Tabs extends React.Component {
  static propTypes = {
    tab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    parentMutator: PropTypes.object,
    parentResources: PropTypes.object,
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

  getPersistedQuery = (id) => {
    const { parentResources } = this.props;
    let prev = { filters: null, sort: null };
    if (id === 'agreements') prev = parentResources.queryAgreements;
    else if (id === 'eresources') prev = parentResources.queryEresources;

    return prev;
  }

  persistSortAndFilters = () => {
    const { parentMutator, parentResources } = this.props;
    const { tab } = this.state;
    let mutator;

    if (tab === 'agreements') mutator = parentMutator.queryAgreements;
    else if (tab === 'eresources') mutator = parentMutator.queryEresources;
    else return;

    mutator.replace({
      filters: parentResources.query.filters,
      sort: parentResources.query.sort,
    });
  }

  setTab = () => {
    const { tab } = this.props;
    if (!tab) return;
    this.setState({ tab });
  }

  handleNavigate = (e) => {
    const { id } = e.currentTarget;

    this.persistSortAndFilters();

    this.setState({ tab: id });

    this.props.parentMutator.query.replace({
      _path: `/erm/${id}`,
      addFromBasket: null,
      layer: null,
      ...this.getPersistedQuery(id),
    });

    this.props.parentMutator.resultCount.replace(1);
  }

  render() {
    const { tab } = this.state;

    return (
      <IfEResourcesEnabled>
        <div className={css.SegControl}>
          <ButtonGroup tagName="nav">
            <Button
              id="agreements"
              buttonStyle={tab === 'agreements' ? 'primary' : undefined}
              fullWidth
              onClick={this.handleNavigate}
            >
              <FormattedMessage id="ui-agreements.tabs.agreements" />
            </Button>
            <Button
              id="eresources"
              buttonStyle={tab === 'eresources' ? 'primary' : undefined}
              fullWidth
              onClick={this.handleNavigate}
            >
              <FormattedMessage id="ui-agreements.tabs.eresources" />
            </Button>
          </ButtonGroup>
        </div>
      </IfEResourcesEnabled>
    );
  }
}

export default Tabs;
