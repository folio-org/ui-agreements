import {
  clickable,
  interactor,
  isPresent,
  property,
} from '@bigtest/interactor';

export default @interactor class SuppressFromDiscoveryFieldArrayInteractor {
  isDescription = isPresent('[data-test-sfdfa-description]');
  isAgreementLine = isPresent('[data-test-sfdfa-agreement-line]');
  checkAgreementLine = clickable('[data-test-sfdfa-agreement-line]');
  agreementLineFieldName = property('[data-test-sfdfa-agreement-line]', 'name')

  isPCI = isPresent('[data-test-sfdfa-pci]');
  checkPCI = clickable('[data-test-sfdfa-pci]');
  pciFieldName = property('[data-test-sfdfa-pci]', 'name')
}
