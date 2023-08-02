import PropTypes from 'prop-types';

import { renderWithIntl, Button as ButtonInteractor } from '@folio/stripes-erm-testing';

import { useFileHandlers } from '@folio/stripes-erm-components';

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
