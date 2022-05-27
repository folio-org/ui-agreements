import {
  interactor,
  clickable,
} from '@interactors/html';

export default @interactor class BasketInteractor {
  clickOpenBasket = clickable('#open-basket-button');
  clickCreateNewAgreement = clickable('[data-test-basket-create-agreement]');
}
