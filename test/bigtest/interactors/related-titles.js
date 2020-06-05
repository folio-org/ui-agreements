import {
  interactor,
  text,
} from '@bigtest/interactor';

export default @interactor class RelatedTitlesInteractor {
  // static defaultScope = '[data-test-related-titles]';

  titleInstanceName = text('[data-test-title-instance-name]');
  titleInstanceSubType = text('[data-test-title-instance-sub-type]');
  titleInstanceISBN = text('[data-test-isbn]');
  titleInstanceDOI = text('[data-test-doi]');
  titleInstanceEZB = text('[data-test-ezb]');
  titleInstanceZDB = text('[data-test-zdb]');
  titleInstanceEISSN = text('[data-test-eissn]');
  titleInstanceISSN = text('[data-test-issn]');
}
