import {
  interactor,
  text,
} from '@bigtest/interactor';

export default @interactor class EresourceViewInteractor {
  headline = text('#package-info [data-test-headline]');
  eresourceName = text('[data-test-eresource-name]');
}
