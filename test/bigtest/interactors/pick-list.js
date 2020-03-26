import {
  interactor,
  clickable,
  collection,
  count,
  isPresent,
  property,
  scoped,
  text
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor'; // eslint-disable-line
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor'; // eslint-disable-line

const rowSelector = '[class*=editListRow--]';
const cellSelector = '[class*=mclCell--]';

const CellInteractor = interactor(class CellInteractor {
  content = text();
});

const RowInteractor = interactor(class RowInteractor {
  cells = collection(cellSelector, CellInteractor);
  cellCount = count(cellSelector);
  click = clickable();

  isEditPickListButtonPresent = isPresent('[id^="clickable-edit-pick-lists-"]');
  isDeletePickListButtonPresent = isPresent('[id^="clickable-delete-pick-lists-"]');

  isEditPickListValuesButtonPresent = isPresent('[id^="clickable-edit-pick-list-values-"]');
  isDeletePickListValuesButtonPresent = isPresent('[id^="clickable-delete-pick-list-values-"]');

  editButton = scoped('[icon=edit]', ButtonInteractor);
  deleteButton = scoped('[icon=trash]', ButtonInteractor);
});

@interactor class ListInteractor {
  rowCount = count(rowSelector);
  rows = collection(rowSelector, RowInteractor);
}

export default @interactor class PickListInteractor {
  list = new ListInteractor('#editList-pick-lists');
  valuesList = new ListInteractor('#editList-pick-list-values');
  pickListDropdown = new SelectInteractor('[class*=selectWrap---]');
  isNewButtonDisabled = property('#clickable-add-pick-list-values', 'disabled');
  clickableNewButton = clickable('#clickable-add-pick-list-values');
}
