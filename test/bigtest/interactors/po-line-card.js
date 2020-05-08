import {
  attribute,
  interactor,
  text,
} from '@bigtest/interactor';

export default @interactor class POLineCardInteractor {
  static defaultScope = '[data-test-poline-card]';

  textContent = text();

  id = attribute('id');
  acqMethod = text('[data-test-poline-acq-method]');
  title = text('[data-test-poline-title]');
  poLineNumber = text('[data-test-poline-number]');
}
