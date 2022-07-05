import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { mockErmComponents, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';

import { useFileHandlers } from '@folio/stripes-erm-components';

import { Button as ButtonInteractor } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import withFileHandlers from './withFileHandlers';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents
}));

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

const mockDownload = jest.fn();
const mockUpload = jest.fn();

const MockWithHOC = withFileHandlers(MockApp);

describe('withFileHandlers', () => {
  useFileHandlers.mockImplementation(() => ({
    handleDownloadFile: mockDownload,
    handleUploadFile: mockUpload
  }));

  describe('rendering the MockApp', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <MockWithHOC />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('calls the Download button', async () => {
      await ButtonInteractor('Download').click();
      expect(mockDownload).toHaveBeenCalledTimes(1);
    });

    test('calls the Upload button', async () => {
      await ButtonInteractor('Upload').click();
      expect(mockUpload).toHaveBeenCalledTimes(1);
    });
  });
});
