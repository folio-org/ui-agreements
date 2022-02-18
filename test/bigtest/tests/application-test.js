import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ApplicationInteractor from '../interactors/application';

describe('Application', () => {
  const app = new ApplicationInteractor();

  setupApplication();

  beforeEach(async function () {
    await this.visit('/');
  });

  it.skip('renders', () => {
    expect(app.isPresent).to.be.true;
  });
});
