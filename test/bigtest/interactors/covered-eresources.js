import {
  attribute,
  interactor,
  clickable,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

/* import {
  interactor,
  is,
  attribute,
  hasClass
} from '@bigtest/interactor';

import css from '../Button.css';

export default interactor(class ButtonInteractor {
  static defaultScope = `.${css.button}`;
  id = attribute('id');
  href = attribute('href');
  isAnchor = is('a');
  isButton = is('button');
  rendersDefault = hasClass(css.default);
  rendersPrimary = hasClass(css.primary);
  rendersBottomMargin0 = hasClass(css.marginBottom0)
}); */

@interactor class ExportButton {
  disabled = attribute('disabled');
  id = attribute('id');
  // disabled = attribute('disabled');
}

export default @interactor class CoveredEresourcesListInteractor {
  clickAll = clickable('#clickable-pci-all');
  clickCurrent = clickable('#clickable-pci-current');
  clickFuture = clickable('#clickable-pci-future');
  clickDropped = clickable('#clickable-pci-dropped');
  exportButton = new ExportButton('#clickable-dropdown-export-eresources');

  list = new MultiColumnListInteractor('#eresources-covered');
  eresourceName = index => this.list.rows(index).cells(0).content;
}
