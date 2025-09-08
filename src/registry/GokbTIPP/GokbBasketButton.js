import { FormattedMessage, useIntl } from 'react-intl';
import noop from 'lodash/noop';

import {
  IconButton,
  Tooltip
} from '@folio/stripes/components';

import {
  useBasket,
} from '../../hooks';

import IconDropdown from '../../components/IconDropdown';
import { buildPackageEntitlementOption, buildPCIEntitlementOption } from '../../components/utilities';

// Button component for adding GoKB title/package to basket FROM a TIPP resource
const GoKbBasketButton = ({
  tipp, // The GOKB tipp record
  pci, // The PCI in local KB (if exists)
  pciLoading, // Is the query which fetches the PCIs still loading?
  pkg, // The PKG in local KB (if exists)
  pkgLoading // Is the query which fetches the PCIs still loading?
}) => {
  const intl = useIntl();
  const { addToBasket, existsInBasket, removeFromBasket } = useBasket();


  if (!pkg && !pkgLoading) {
    // This is an iconButton so we can do a tooltip
    return (
      <Tooltip
        id={`pkg-for-tipp-${tipp.uuid}-not.present`}
        text={<FormattedMessage id="ui-agreements.gokbSearch.basket.packageNameNotInKB" values={{ name: tipp.tippPackageName }} />}
      >
        {({ ref, ariaIds }) => (
          <IconButton
            ref={ref}
            aria-describedby={ariaIds.sub}
            aria-labelledby={ariaIds.text}
            icon="ellipsis"
          />
        )}
      </Tooltip>
    );
  }


  const getPackageOption = () => {
    if (pkgLoading) {
      return ({
        icon: 'spinner-ellipsis',
        label: <FormattedMessage id="ui-agreements.gokbSearch.basket.addPackageToBasket" />,
        onClick: () => noop,
        disabled: true
      });
    }

    if (!pkgLoading && !pkg) {
      return (
        {
          icon: 'plus-sign',
          label: <FormattedMessage id="ui-agreements.gokbSearch.basket.noPackageMatches" />,
          onClick: () => noop,
          disabled: true
        }
      );
    }

    const packageInBasket = existsInBasket(pkg.id);
    const basketPackage = buildPackageEntitlementOption(pkg);
    const packageBasketFunction = packageInBasket ? removeFromBasket : addToBasket;

    const label = <FormattedMessage id={`ui-agreements.gokbSearch.basket.${packageInBasket ? 'removePackageFromBasket' : 'addPackageToBasket'}`} />;
    return ({
      icon: packageInBasket ? 'trash' : 'plus-sign',
      label,
      onClick: () => packageBasketFunction(basketPackage),
    });
  };

  const getTitleOption = () => {
    if (pciLoading) {
      return ({
        icon: 'spinner-ellipsis',
        label: <FormattedMessage id="ui-agreements.gokbSearch.basket.addTitleToBasket" />,
        onClick: () => noop,
        disabled: true
      });
    }

    const basketTipp = pci ?
      buildPCIEntitlementOption(pci) :
      {
        id: tipp.uuid || tipp.id,
        name: tipp.name,
        type: 'GoKBTitle',
        _object: tipp
      };

    const tippInBasket = existsInBasket(basketTipp.id);
    const tippBasketFuction = tippInBasket ? removeFromBasket : addToBasket;

    return (
      {
        icon: tippInBasket ? 'trash' : 'plus-sign',
        label: <FormattedMessage id={`ui-agreements.gokbSearch.basket.${tippInBasket ? 'removeTitleFromBasket' : 'addTitleToBasket'}`} />,
        onClick: () => tippBasketFuction(basketTipp)
      }
    );
  };

  const tooltipLabel = intl.formatMessage(
    {
      id: 'ui-agreements.gokbSearch.basket.manageBasketForPackageName'
    },
    {
      name: tipp.tippPackageName
    }
  );

  const iconButtonId = `manage-basket-for-${tipp.uuid}`;

  return (
    <IconDropdown
      options={[
        getTitleOption(),
        getPackageOption()
      ]}
      triggerProps={{
        id: iconButtonId,
        'aria-label': tooltipLabel,
        tooltipProps: {
          id: iconButtonId, // Point tooltip aria-labels at iconButton id
          text: tooltipLabel
        }
      }}
    />
  );
};

export default GoKbBasketButton;
