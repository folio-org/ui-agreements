/* EXAMPLE Grab actual hooks for anything not mocked here */
const hooks = jest.requireActual('../index');

module.exports = {
  ...hooks,
  useAgreementsSettings: () => ({ parsedSettings: {} }),
};
