import React from 'react';
import PropTypes from 'prop-types';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { checkScope, collapseAllSections, expandAllSections } from '@folio/stripes-erm-components';
import View from '../components/views/UrlCustomizerForm';
import { urls } from '../components/utilities';

class UrlCustomizerCreateRoute extends React.Component {
  static manifest = Object.freeze({
    stringTemplate: {
      type: 'okapi',
      path: 'erm/sts',
      fetch: false,
    },
  });

  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        agreementId: PropTypes.string.isRequired,
      }).isRequired
    }).isRequired,
    mutator: PropTypes.shape({
      entitlements: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }),
    }),
    resources: PropTypes.shape({
      basket: PropTypes.arrayOf(PropTypes.object),
      line: PropTypes.object,
      orderLines: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasInterface: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  static contextType = CalloutContext;

  handleClose = () => {
    const {
      history,
      location,
      match: { params: { platformId } },
    } = this.props;
    history.push(`${urls.platformView(platformId)}${location.search}`);
  }

  handleSubmit = (urlCustomization) => {
    const {
      history,
      match: { params: { platformId } },
      mutator,
      location
    } = this.props;

    return mutator.stringTemplate
      .POST({ ...urlCustomization, 'idScopes': [platformId], 'context': 'urlCustomiser' })
      .then(({ id }) => {
        this.context.sendCallout({ message: <SafeHTMLMessage id="ui-agreements.line.create.callout" /> });
        history.push(`${urls.urlCustomizerView(platformId, id)}${location.search}`);
      });
  }

  render() {
    const { isSuppressFromDiscoveryEnabled } = this.props;

    return (
      <View
        handlers={{
          ...this.props.handlers,
          checkScope,
          collapseAllSections,
          expandAllSections,
          isSuppressFromDiscoveryEnabled,
          onClose: this.handleClose,
        }}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(UrlCustomizerCreateRoute);
