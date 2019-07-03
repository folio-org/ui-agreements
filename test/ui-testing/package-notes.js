const Pkg = require('./er-notes');

const PKG = {
  name: 'K-Int Test Package 001',
  type: 'Package',
};

module.exports.test = (uiTestCtx) => {
  Pkg.test(
    uiTestCtx,
    {
      eresource: PKG,
    },
  );
};
