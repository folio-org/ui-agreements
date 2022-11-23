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

  switch (primary) {
    case 'agreements':
      selectedIndex = 0;
      break;
    case 'agreementLines':
      selectedIndex = 1;
      break;
    case 'eresources':
      selectedIndex = 0;
      break;
    case 'packages':
      selectedIndex = 1;
      break;
    case 'titles':
      selectedIndex = 2;
      break;
    case 'platforms':
      selectedIndex = 3;
      break;
    default:
      break;
  }

  // Render agreement search options
  if (pathname?.startsWith('/erm/agreements') || pathname?.startsWith('/erm/agreementLines')) {
    return (
      <ResponsiveButtonGroup
        fullWidth
        selectedIndex={selectedIndex}
      >
        <Button
          key="clickable-nav-agreements"
          id="clickable-nav-agreements"
          to={pathname?.startsWith('/erm/agreements') ? null : urls.agreements()}
        >
          <FormattedMessage id="ui-agreements.agreements" />
        </Button>
        <Button
          key="clickable-nav-agreementLines"
          id="clickable-nav-agreementLines"
          to={pathname?.startsWith('/erm/agreementLines') ? null : urls.agreementLines()}
        >
          <FormattedMessage id="ui-agreements.agreementLines" />
        </Button>
      </ResponsiveButtonGroup>
    );
  }

  // Render internal KB search options
  const button = [];
  if (stripes.hasPerm('ui-agreements.resources.view')) {
    button.push(
      <Button
        key="clickable-nav-eresources"
        id="clickable-nav-eresources"
        to={pathname?.startsWith('/erm/eresources') ? null : urls.eresources()}
      >
        <FormattedMessage id="ui-agreements.eresources" />
      </Button>
    );

    button.push(
      <Button
        key="clickable-nav-packages"
        id="clickable-nav-packages"
        to={pathname?.startsWith('/erm/packages') ? null : urls.packages()}
      >
        <FormattedMessage id="ui-agreements.packages" />
      </Button>
    );

    button.push(
      <Button
        key="clickable-nav-titles"
        id="clickable-nav-titles"
        to={pathname?.startsWith('/erm/titles') ? null : urls.titles()}
      >
        <FormattedMessage id="ui-agreements.eresources.titles" />
      </Button>
    );
  }

  if (stripes.hasPerm('ui-agreements.platforms.view')) {
    button.push(
      <Button
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
