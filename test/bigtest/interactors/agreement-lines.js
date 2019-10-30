import {
  interactor,
  clickable,
} from '@bigtest/interactor';

import CoveredEresourcesListInteractor from './covered-eresources';

export default @interactor class AgreementLinesInteractor {
  clickLinesAccordion = clickable('#accordion-toggle-button-lines');
  coveredEresourcesList = new CoveredEresourcesListInteractor();

  whenLoaded() {
    return this.when(() => this.isViewAgreement);
  }
}
