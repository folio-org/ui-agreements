import {
  Button,
  ButtonGroup
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { urls } from '../utilities';

// A consistent component designed to allow switching between the ui-agreements top level routes
const RouteSwitcher = () => {
  const { pathname } = useLocation();

  // Render agreement search options
  if (pathname?.startsWith('/erm/agreements') || pathname?.startsWith('/erm/agreementLines')) {
    return (
      <ButtonGroup fullWidth>
        <Button
          buttonStyle={pathname?.startsWith('/erm/agreements') ? 'primary' : 'default'}
          id="clickable-nav-agreements"
          to={pathname?.startsWith('/erm/agreements') ? null : urls.agreements()}
        >
          <FormattedMessage id="ui-agreements.agreements" />
        </Button>
        <Button
          buttonStyle={pathname?.startsWith('/erm/agreementLines') ? 'primary' : 'default'}
          id="clickable-nav-agreementLines"
          to={pathname?.startsWith('/erm/agreementLines') ? null : urls.agreementLines()}
        >
          <FormattedMessage id="ui-agreements.agreementLines" />
        </Button>
      </ButtonGroup>
    );
  }

  // Render internal KB search options
  return (
    <ButtonGroup fullWidth>
      <IfPermission perm="ui-agreements.resources.view">
        <Button
          buttonStyle={pathname?.startsWith('/erm/eresources') ? 'primary' : 'default'}
          id="clickable-nav-eresources"
          to={pathname?.startsWith('/erm/eresources') ? null : urls.eresources()}
        >
          <FormattedMessage id="ui-agreements.eresources" />
        </Button>
      </IfPermission>
      <IfPermission perm="ui-agreements.resources.view">
        <Button
          buttonStyle={pathname?.startsWith('/erm/titles') ? 'primary' : 'default'}
          id="clickable-nav-titles"
          to={pathname?.startsWith('/erm/titles') ? null : urls.titles()}
        >
          <FormattedMessage id="ui-agreements.eresources.titles" />
        </Button>
      </IfPermission>
      <IfPermission perm="ui-agreements.platforms.view">
        <Button
          buttonStyle={pathname?.startsWith('/erm/platforms') ? 'primary' : 'default'}
          id="clickable-nav-platforms"
          to={pathname?.startsWith('/erm/platforms') ? null : urls.platforms()}
        >
          <FormattedMessage id="ui-agreements.platforms" />
        </Button>
      </IfPermission>
    </ButtonGroup>
  );
};

export default RouteSwitcher;
