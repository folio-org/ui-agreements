import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import AgreementLinesInteractor from './agreement-lines';

export default @interactor class AgreementViewInteractor {
  isViewAgreement = isPresent('#pane-view-agreement');
  lines = new AgreementLinesInteractor();

  whenLoaded() {
    return this.when(() => this.isViewAgreement);
  };
}
