import {
  interactor,
  clickable,
  text,
} from '@bigtest/interactor';

import PackageContentInteractor from './package-content';

export default @interactor class EresourceViewInteractor {
  headline = text('#package-info [data-test-headline]');
  eresourceName = text('[data-test-eresource-name]');

  clickAddToBasket = clickable('[data-test-basket-add-button]');

  packageContent = new PackageContentInteractor();
}
