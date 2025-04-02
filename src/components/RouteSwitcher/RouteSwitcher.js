import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { ResponsiveButtonGroup } from '@k-int/stripes-kint-components';
import { useStripes } from '@folio/stripes/core';
import { urls } from '../utilities';

// A consistent component designed to allow switching between the ui-agreements top level routes
// TODO we can probably centralise the core idea here in kint-components or otherwise,
// and then either have a memoised set of options for each group, or have a component which renders the central one.
// Either way, this needs copying over to the Licenses implementation
const RouteSwitcher = () => {
  const { pathname } = useLocation();
  const stripes = useStripes();

  const agreementTabOptions = useMemo(() => [
    {
      name: 'agreements',
      label: <FormattedMessage id="ui-agreements.agreements" />,
      urlRoot: '/erm/agreements',
      redirect: urls.agreements(),
    },
    {
      name: 'agreementLines',
      label: <FormattedMessage id="ui-agreements.agreementLines" />,
      urlRoot: '/erm/agreementLines',
      redirect: urls.agreementLines(),
    },
  ], []);

  const kbTabOptions = useMemo(() => [
    {
      name: 'packages',
      label: <FormattedMessage id="ui-agreements.packages" />,
      urlRoot: '/erm/packages',
      redirect: urls.packages(),
      perm: 'ui-agreements.resources.view'
    },
    {
      name: 'titles',
      label: <FormattedMessage id="ui-agreements.eresources.titles" />,
      urlRoot: '/erm/titles',
      redirect: urls.titles(),
      perm: 'ui-agreements.resources.view'
    },
    {
      name: 'platforms',
      label: <FormattedMessage id="ui-agreements.platforms" />,
      urlRoot: '/erm/platforms',
      redirect: urls.platforms(),
      perm: 'ui-agreements.platforms.view'
    }
  ], []);

  const selectedTabGroup = useMemo(() => {
    for (const tabGroup of [agreementTabOptions, kbTabOptions]) {
      if (tabGroup.some(tab => pathname.startsWith(tab.urlRoot))) {
        return tabGroup;
      }
    }

    return [];
  }, [agreementTabOptions, kbTabOptions, pathname]);

  const selectedIndex = useMemo(() => {
    return selectedTabGroup.findIndex(tab => pathname.startsWith(tab.urlRoot));
  }, [pathname, selectedTabGroup]);

  const renderedTabs = useMemo(() => {
    return selectedTabGroup.map(tab => {
      if (!tab.perm || stripes.hasPerm(tab.perm)) {
        return tab;
      }
      return null;
    }).filter(Boolean);
  }, [selectedTabGroup, stripes]);

  if (renderedTabs.length === 0) {
    return null;
  }

  return (
    <ResponsiveButtonGroup
      fullWidth
      selectedIndex={selectedIndex}
    >
      {renderedTabs.map((tab) => (
        <Button
          key={`clickable-nav-${tab.name}`}
          id={`clickable-nav-${tab.name}`}
          to={pathname.startsWith(tab.urlRoot) ? null : tab.redirect}
        >
          {tab.label}
        </Button>
      ))}
    </ResponsiveButtonGroup>
  );
};

export default RouteSwitcher;
