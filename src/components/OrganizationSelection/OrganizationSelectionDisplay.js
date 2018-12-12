import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  OptionSegment,
  Selection,
} from '@folio/stripes/components';

export default class OrganizationSelectionDisplay extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onChange: PropTypes.func,
    onFilter: PropTypes.func,
    organizations: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      })
    ),
    searchString: PropTypes.string,
    value: PropTypes.string,
  };

  render() {
    const { loading, onChange, onFilter, organizations, searchString, value } = this.props;
    return (
      <FormattedMessage id="ui-agreements.organizations.selectOrg">
        {placeholder => (
          <Selection
            dataOptions={organizations}
            emptyMessage={!searchString ? <FormattedMessage id="ui-agreements.organizations.typeToSearch" /> : undefined}
            formatter={(props) => {
              const { option } = props;
              if (loading || !option) return <Icon icon="spinner-ellipsis" />;

              return <OptionSegment {...props}>{option.label}</OptionSegment>;
            }}
            onChange={onChange}
            onFilter={onFilter}
            placeholder={placeholder}
            value={value}
          />
        )}
      </FormattedMessage>
    );
  }
}
