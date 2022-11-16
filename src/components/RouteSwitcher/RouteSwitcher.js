import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';
import { ResponsiveButtonGroup } from '@k-int/stripes-kint-components';
import { useStripes } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { urls } from '../utilities';

// A consistent component designed to allow switching between the ui-agreements top level routes
const RouteSwitcher = ({ primary }) => {
  const { pathname } = useLocation();
  const stripes = useStripes();
  let selectedIndex;

  // Render agreement search options
  if (pathname?.startsWith('/erm/agreements') || pathname?.startsWith('/erm/agreementLines')) {
    switch (primary) {
      case 'agreements':
        selectedIndex = 0;
        break;
      case 'agreementLines':
        selectedIndex = 1;
        break;
      default:
        break;
    }
    return (
      <ResponsiveButtonGroup
        fullWidth
        selectedIndex={selectedIndex}
      >
        <Button
          key="clickable-nav-agreements"
          buttonStyle={pathname?.startsWith('/erm/agreements') ? 'primary' : 'default'}
          id="clickable-nav-agreements"
          to={pathname?.startsWith('/erm/agreements') ? null : urls.agreements()}
        >
          <FormattedMessage id="ui-agreements.agreements" />
        </Button>
        <Button
          key="clickable-nav-agreementLines"
          buttonStyle={pathname?.startsWith('/erm/agreementLines') ? 'primary' : 'default'}
          id="clickable-nav-agreementLines"
          to={pathname?.startsWith('/erm/agreementLines') ? null : urls.agreementLines()}
        >
          <FormattedMessage id="ui-agreements.agreementLines" />
        </Button>
      </ResponsiveButtonGroup>
    );
  }

  // Render internal KB search options
  switch (primary) {
    case 'eresources':
      selectedIndex = 0;
      break;
    case 'titles':
      selectedIndex = 1;
      break;
    case 'platforms':
      selectedIndex = 2;
      break;
    default:
      break;
  }

  const button = [];
  if (stripes.hasPerm('ui-agreements.resources.view')) {
    button.push(
      <Button
        // buttonStyle={pathname?.startsWith('/erm/eresources') ? 'primary' : 'default'}
        key="clickable-nav-eresources"
        id="clickable-nav-eresources"
        to={pathname?.startsWith('/erm/eresources') ? null : urls.eresources()}
      >
        <FormattedMessage id="ui-agreements.eresources" />
      </Button>
    );
  }

  if (stripes.hasPerm('ui-agreements.platforms.view')) {
    button.push(
      <Button
          // buttonStyle={pathname?.startsWith('/erm/platforms') ? 'primary' : 'default'}
        key="clickable-nav-platforms"
        id="clickable-nav-platforms"
        to={pathname?.startsWith('/erm/platforms') ? null : urls.platforms()}
      >
        <FormattedMessage id="ui-agreements.platforms" />
      </Button>
    );
  }

  return button.length ?
    <ResponsiveButtonGroup
      fullWidth
      selectedIndex={selectedIndex}
    >
      {button}
    </ResponsiveButtonGroup>
    : null;
};

RouteSwitcher.propTypes = {
  primary: PropTypes.string
};

export default RouteSwitcher;
