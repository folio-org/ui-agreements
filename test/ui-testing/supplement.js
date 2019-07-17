const Docs = require('./docs');

const DOCS = [{
  name: 'Misc Paper',
  note: 'Signed and filed',
  location: 'Filing Cabinet',
  url: 'http://agreements.com/paper'
}, {
  name: 'Folder of secrets',
  url: 'http://agreements.com/secrets'
}];

const EDITED_DOC = {
  docToEdit: DOCS[0].name,
  name: 'Misc Paper v2',
  note: 'Need to sign',
  location: 'Printer Tray',
  url: 'http://agreements.com/paper2'
};

const DELETED_DOC = DOCS[1].name;

const DOCS_FIELD_NAME = 'supplementaryDocs';

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
