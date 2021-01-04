import {
  collection,
  fillable,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class PageSizeFieldsInteractor {
  mclPageSizeField = text('[data-test-mcl-page-size]');
  isMclPageSizeFieldPresent = isPresent('[data-test-mcl-page-size]');
  fillMclPageSizeField = fillable('[data-test-mcl-page-size]');
}

export default @interactor class MCLPaginationInteractor {
  isDescription = isPresent('[data-test-mcl-description]');
  pageSizeFields = collection('[data-test-mcl-page-size-fields]', PageSizeFieldsInteractor);
}
