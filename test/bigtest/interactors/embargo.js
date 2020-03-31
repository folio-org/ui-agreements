import {
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class EmbargoInteractor {
  static defaultScope = '[data-test-embargo]';

  exists = isPresent('div');

  movingWallEndExists = isPresent('[data-test-embargo-end]')
  movingWallStartExists = isPresent('[data-test-embargo-start]')
  endLength = text('[data-test-embargo-end-length]')
  endUnit = text('[data-test-embargo-end-unit]')
  startLength = text('[data-test-embargo-start-length]')
  startUnit = text('[data-test-embargo-start-unit]')
}

export default EmbargoInteractor;
