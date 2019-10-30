import {
  interactor,
  clickable,
} from '@bigtest/interactor';

export default @interactor class BasketInteractor {
  addToBasketButtion = clickable('[data-test-add-package-to-basket]');
  clickOpenBasket = clickable('#open-basket-button');
  clickCreateNewAgreement = clickable('[data-test-basket-create-agreement]');
}
