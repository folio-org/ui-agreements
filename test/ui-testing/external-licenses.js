const Docs = require('./docs');

const DOCS = [{
  name: 'Final Copy',
  note: 'Signed and filed',
  location: 'Filing Cabinet',
  url: 'http://licenses.com/final'
}, {
  name: 'Initial Copy',
  url: 'http://licenses.com/initial'
}];

const EDITED_DOC = {
  docToEdit: DOCS[0].name,
  name: 'Final Copy v2',
  note: 'Need to sign',
  location: 'Printer Tray',
  url: 'http://licenses.com/final2'
};

const DELETED_DOC = DOCS[1].name;

const DOCS_FIELD_NAME = 'externalLicenseDocs';

module.exports.test = (uiTestCtx) => {
  Docs.test(
    uiTestCtx,
    {
      docs: DOCS,
      editedDoc: EDITED_DOC,
      deletedDoc: DELETED_DOC,
      docsFieldName: DOCS_FIELD_NAME,
    },
  );
};
