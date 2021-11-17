import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import withFileHandlers from './withFileHandlers';

const MockApp = (props) => {
  return (
    <>
      <button onClick={props.handlers.onUploadFile} type="button">Upload</button>
      <button onClick={props.handlers.onDownloadFile} type="button">Download</button>
    </>
  );
};

MockApp.propTypes = {
  handlers: PropTypes.shape({
    onDownloadFile: PropTypes.func,
    onUploadFile: PropTypes.func
  })
};

const stripes = {
  okapi: {
    tenant: 'diku_admin',
    token: 'okapiToken'
  }
};

window.fetch = jest.fn((url, options) => {
  return new Promise((resolve, _reject) => {
    if (url.includes('raw')) { resolve({ blob: () => Promise.resolve('downloaded') }); } else if (options.method === 'POST') resolve({ ok: true, json: () => Promise.resolve({ id: 123 }) });
  });
});

const MockWithHOC = withFileHandlers(MockApp);

describe('withFileHandlers', () => {
  describe('rendering the MockApp', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <MockWithHOC stripes={stripes} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('calls the Download button', async () => {
      await ButtonInteractor('Download').click();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('calls the Upload button', async () => {
      await ButtonInteractor('Upload').click();
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
