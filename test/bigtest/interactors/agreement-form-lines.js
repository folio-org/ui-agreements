import {
  interactor,
  collection,
  count,
  text,
} from '@bigtest/interactor';

@interactor class AgreementFormLineInteractor {
  name = text('[data-test-ag-line-name]')
}

export default @interactor class AgreementFormLinesInteractor {
  lineCount = count('[data-test-ag-line-number]');

  lines = collection('[data-test-ag-line-number]', AgreementFormLineInteractor);
}
