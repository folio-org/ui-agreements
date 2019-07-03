const Title = require('./er-notes');

const TITLE = {
  name: '21 for 21',
  type: 'Book',
};

module.exports.test = (uiTestCtx) => {
  Title.test(
    uiTestCtx,
    {
      eresource: TITLE,
    },
  );
};
