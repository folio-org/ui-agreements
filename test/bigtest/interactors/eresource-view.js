import {
  interactor,
  text,
} from '@bigtest/interactor';

import PackageContentInteractor from './package-content';

export default @interactor class EresourceViewInteractor {
  headline = text('#package-info [data-test-headline]');
  eresourceName = text('[data-test-eresource-name]');

  packageContent = new PackageContentInteractor();
}
