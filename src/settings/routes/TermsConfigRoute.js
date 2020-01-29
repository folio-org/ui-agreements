import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import TermsConfigForm from '../components/TermsConfig/TermsConfigForm';

class TermsConfigRoute extends React.Component {
  static manifest = Object.freeze({
    terms: {
      type: 'okapi',
      path: 'erm/custprops',
      params: {
        sort: 'id;desc'
      },
      clientGeneratePk: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      terms: PropTypes.object,
    }),
    mutator: PropTypes.shape({
      terms: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }),
  }

  state = {
    // loadedAt is used in gDSFP to determine whether to reinit form values
    loadedAt: new Date(), // eslint-disable-line react/no-unused-state
    terms: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    const terms = get(props, 'resources.terms'); // can't use default value bc of `null`
    if (terms && terms.hasLoaded && terms.loadedAt > state.loadedAt) {
      newState.loadedAt = terms.loadedAt;
      newState.terms = terms.records.map(term => ({
        ...term,
        category: term.category ? term.category.id : undefined,
      }));
    }

    return Object.keys(newState).length ? newState : null;
  }

  handleDelete = (term) => {
    return this.props.mutator.terms.DELETE(term);
  }

  handleSave = (term) => {
    const mutator = this.props.mutator.terms;

    const promise = term.id ?
      mutator.PUT(term, { pk: term.id }) :
      mutator.POST(term);

    return promise;
  }

  render() {
    const { terms } = this.state;

    return (
      <TermsConfigForm
        initialValues={{ terms }}
        onDelete={this.handleDelete}
        onSave={this.handleSave}
        onSubmit={this.handleSave}
      />
    );
  }
}

export default stripesConnect(TermsConfigRoute);
