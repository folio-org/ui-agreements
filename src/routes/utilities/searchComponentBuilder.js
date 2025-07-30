import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import {
  transformSearchParameter,
  buildSearchOptions,
} from './searchTransformation';

export const searchComponentConstructors = {
  queryDropdown: (config, options = {}) => {
    const { onChange, value = '', id = 'search-dropdown' } = options;

    // Build search options from config
    const searchOptions = buildSearchOptions(config);
    return {
      type: 'queryDropdown',
      component: (
        <Select
          dataOptions={searchOptions}
          id={id}
          onChange={onChange}
          placeholder={
            <FormattedMessage id="ui-agreements.gokbSearch.searchBy" />
          }
          value={value}
        />
      ),
      options: searchOptions,
      handleSearchTransformation: (searchOption, searchString) => {
        return transformSearchParameter(config, searchOption, searchString);
      },
      getSASQMapUpdate: (selectedOption) => {
        // return SASQ map updates based on selected option
        return {
          searchKey: selectedOption || 'keyword',
        };
      },
    };
  },
  static: (config, options = {}) => {
    const { searchKey, uuid } = options;

    return {
      type: 'static',
      component: null,
      getSASQMapUpdate: () => ({
        searchKey: searchKey || uuid || 'uuid',
      }),
    };
  },
  // TODO:Add more constructors as needed for different types
};

export const buildSearchComponent = (config, options = {}) => {
  if (!config || !config.type) {
    console.warn('Invalid config provided to buildSearchComponent:', config);
    return null;
  }

  const constructor = searchComponentConstructors[config.type];
  if (!constructor) {
    console.warn(`No constructor found for search type: ${config.type}`);
    return null;
  }

  return constructor(config, options);
};

export const buildSearchHeaderComponent = (searchConfig, options = {}) => {
  if (!searchConfig) {
    console.warn('No search config provided');
    return null;
  }

  // The config is already the search configuration object
  return buildSearchComponent(searchConfig, {
    ...options,
    id: options.id || 'gokb-search-header-select',
  });
};

export const processSearchOptions = (options = []) => {
  return options.map((option) => {
    if (option.type === 'Handlebars') {
      return {
        ...option,
        processor: (searchString) =>
          transformSearchParameter(
            { options: [option] },
            option.name,
            searchString
          ),
      };
    }

    return option;
  });
};

export const createFilterOptions = (searchConfig) => {
  if (!searchConfig?.options) {
    return [];
  }

  const processedOptions = processSearchOptions(searchConfig.options);

  return processedOptions.map((option) => ({
    key: option.name,
    value: option.name,
    label: (
      <FormattedMessage
        id={`ui-agreements.gokbSearch.searchIndex.${option.name}`}
      />
    ),
    processor: option.processor,
    type: option.type,
    parameter: option.parameter,
  }));
};
