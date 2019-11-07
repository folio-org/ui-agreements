import {
  interactor,
  clickable,
  text,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

export default @interactor class CoveredEresourcesListInteractor {
  eresourceName = text('[data-test-eresource-name]');

  clickAll = clickable('#clickable-pci-all');
  clickCurrent = clickable('#clickable-pci-current');
  clickFuture = clickable('#clickable-pci-future');
  clickDropped = clickable('#clickable-pci-dropped');

  list = new MultiColumnListInteractor('#eresources-covered');
}
