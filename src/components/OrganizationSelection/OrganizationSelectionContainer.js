import React from 'react';
import PropTypes from 'prop-types';
import { debounce, get } from 'lodash';

import OrganizationSelectionDisplay from './OrganizationSelectionDisplay';

export default class OrganizationSelectionContainer extends React.Component {
  static manifest = Object.freeze({
    organizations: {
      type: 'okapi',
      path: 'erm/org',
      limitParam: 'perPage',
      perRequest: 100,
      params: {
        match: 'name',
        term: '%{orgNameFilter}',
      },
    },
    orgNameFilter: { initialValue: '' },
  });

  static propTypes = {
    meta: PropTypes.shape({
      error: PropTypes.node,
    }),
    input: PropTypes.shape({
      onChange: PropTypes.func,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    }),
    mutator: PropTypes.shape({
      orgNameFilter: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }),
    resources: PropTypes.shape({
      organizations: PropTypes.object,
    }),
  };

  constructor(props) {
    super(props);

    const { input } = props;
    const selectedOption = input.value ? { value: input.value.id, label: input.value.name } : undefined;
    const organizations = selectedOption ? [selectedOption] : [];

    this.state = {
      organizations,
      searchString: '',
      selectedOption, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const organizations = get(nextProps.resources.organizations, ['records'], [])
      .map(({ id, name }) => ({ value: id, label: name }));

    // If an option is selected and it is /not/ in the list of orgs we just
    // fetched, unshift it onto the list so it's always available for
    // display, highlighting and selection.
    const { selectedOption } = state;
    if (selectedOption && selectedOption.value) {
      if (!organizations.find(o => o.value === selectedOption.value)) {
        organizations.unshift(selectedOption);
      }
    }

    return { organizations };
  }

  updateOrgNameFilter = debounce(
    searchString => this.props.mutator.orgNameFilter.replace(searchString),
    500
  )

  handleFilter = (searchString) => {
    this.setState({ searchString });
    this.updateOrgNameFilter(searchString);
    return this.state.organizations;
  }

  handleChange = (value) => {
    const { organizations } = this.state;
    this.setState({ selectedOption: organizations.find(o => o.value === value) }); // eslint-disable-line react/no-unused-state
    this.props.input.onChange(value);
  }

  render() {
    return (
      <OrganizationSelectionDisplay
        error={get(this.props, ['meta', 'error'])}
        loading={get(this.props.resources, ['organizations', 'isPending'], false)}
        onChange={this.handleChange}
        onFilter={this.handleFilter}
        organizations={this.state.organizations}
        searchString={this.state.searchString}
        value={this.props.input.value.id || this.props.input.value}
      />
    );
  }
}
