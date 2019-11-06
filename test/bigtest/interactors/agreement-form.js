import {
  interactor,
  clickable,
  fillable,
  scoped,
  selectable,
} from '@bigtest/interactor';

import AgreementFormLinesInteractor from './agreement-form-lines';

export default @interactor class AgreementFormInteractor {
  fillName = fillable('#edit-agreement-name');
  selectStatus = selectable('#edit-agreement-status');
  fillStartDate = fillable('#period-start-date-0');
  createAgreement = clickable('#clickable-create-agreement');

  linesSection = scoped('#formLines', AgreementFormLinesInteractor);
}
