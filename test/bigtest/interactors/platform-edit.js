import {
  interactor,
  value
} from '@interactors/html';

export default @interactor class PlatformEditInteractor {
  platformCode = value('#edit-local-platform-code');
}
