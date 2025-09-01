import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import noop from 'lodash/noop';

import { InternalContactsArrayDisplay, OrganizationsArrayDisplay } from '@folio/stripes-erm-components';

import { Button, Dropdown, DropdownMenu, Icon, IconButton } from '@folio/stripes/components';

import AgreementLookup from './AgreementLookup';
import { useBasket } from './hooks';

// IconSelect isn't quite right since this isn't a select its an action menu... no central component for this rn
// FIXME we could add this to kint components quite easily
const IconDropdown = ({
  icon = 'ellipsis',
  options = []
}) => {
  return (
    <Dropdown
      renderMenu={() => {
        return (
          <DropdownMenu>
            {options?.map((option) => (
              <Button
                buttonStyle="dropdownItem"
                onClick={option.onClick ?? noop}
              >
                <Icon icon={option.icon ?? 'ellipsis'}>
                  {option.label}
                </Icon>
              </Button>
            ))}
          </DropdownMenu>
        );
      }}
      renderTrigger={({ onToggle, triggerRef, keyHandler, ariaProps, getTriggerProps }) => {
        return (
          <IconButton
            ref={triggerRef}
            icon="ellipsis"
            marginBottom0
            onClick={onToggle}
            onKeyDown={keyHandler}
            type="button"
            {...getTriggerProps()}
            {...ariaProps}
          />
        );
      }}
    />
  );
};

// Temporary button component for adding GoKB title/package to basket FROM a TIPP resource
const GoKbBasketButton = ({ tipp }) => {
  // FIXME For PACKAGE level we need to fetch the internal package and either add it as is or not give the option
  const { addToBasket, existsInBasket, removeFromBasket } = useBasket();

  const tippBasketItem = {
    id: tipp.uuid || tipp.id,
    name: tipp.name,
    type: 'GoKBTitle',
  };
  const tippInBasket = existsInBasket(tippBasketItem.id);
  const tippBasketFuction = tippInBasket ? removeFromBasket : addToBasket;

  return (
    <IconDropdown
      options={[
        {
          icon: tippInBasket ? 'trash' : 'plus-sign',
          label: <FormattedMessage id={`ui-agreements.gokbSearch.basket.${tippInBasket ? 'removeTitleFromBasket' : 'addTitleToBasket'}`} />,
          onClick: () => tippBasketFuction(tippBasketItem)
        },
        {
          icon: 'plus-sign',
          label: <FormattedMessage id="ui-agreements.gokbSearch.basket.addPackageToBasket" />,
          onClick: () => alert('send package to basket')
        }
      ]}
    />
  );

/*  return (
    <Button
      key={tipp.uuid || tipp.id}
      buttonStyle="primary"
      onClick={() => addToBasket({
        id: tipp.uuid || tipp.id,
        name: tipp.name,
        type: 'GoKBTitle',
      })}
    >
      <FormattedMessage
        defaultMessage={'Add "{name}" to basket'} // FIXME we need to properly intl this
        id="ui-agreements.gokb.addToBasket"
        values={{ name: tipp.name }}
      />
    </Button>
  );*/
};

const setUpRegistry = (registry) => {
  // Agreement Resource
  const agreementReg = registry.registerResource('agreement');

  agreementReg.setViewResources('/erm/agreements');
  agreementReg.setViewResource(agreement => `/erm/agreements/${agreement.id}`);

  agreementReg.setRenderFunction('internalContacts', record => {
    return <InternalContactsArrayDisplay contacts={record.contacts} />;
  });

  agreementReg.setRenderFunction('orgs', record => {
    return <OrganizationsArrayDisplay orgs={record.orgs} />;
  });

  // Lookup plugin
  agreementReg.setLookupComponent(AgreementLookup);

  // AgreementLine Resource
  const aglReg = registry.registerResource('entitlements');
  aglReg.setViewResources('/erm/agreementLines');
  aglReg.setViewResource(al => `/erm/agreementLines/${al.id}/agreement/${al.owner?.id}`);

  aglReg.setRenderFunction('parentAgreement', record => {
    return <Link to={`/erm/agreements/${record.owner.id}`}>{record.owner.name}</Link>;
  });

  // ErmPackage Resource
  const ermPkgReg = registry.registerResource('ermPackage');
  ermPkgReg.setViewResource(pkg => `/erm/packages/${pkg.id}`);

  // GOKB TIPP resource
  const gokbTIPPResource = registry.registerResource('gokbTIPP');
  gokbTIPPResource.setRenderFunction('addToBasketButton', tipp => <GoKbBasketButton tipp={tipp} />);
};

export default setUpRegistry;
