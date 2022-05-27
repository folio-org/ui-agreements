import {
  interactor,
  isPresent,
  text,
} from '@interactors/html';

@interactor class MonographCoverageInteractor {
  static defaultScope = '[data-test-monograph-coverage]';

  exists = isPresent('div');

  date = text('[data-test-date]');
  edition = text('[data-test-edition]');
  volume = text('[data-test-volume]');
}

export default MonographCoverageInteractor;
