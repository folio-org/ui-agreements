import React from 'react';
import PropTypes from 'prop-types';
import { useFileHandlers } from '@folio/stripes-erm-components';

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default function withFileHandlers(WrappedComponent) {
  const WithFileHandlers = ({ handlers, ...rest }) => {
    const { handleDownloadFile, handleUploadFile } = useFileHandlers('erm/files');
    return (
      <WrappedComponent
        handlers={{
          ...handlers,
          onDownloadFile: handleDownloadFile,
          onUploadFile: handleUploadFile,
        }}
        {...rest}
      />
    );
  };

  WithFileHandlers.propTypes = {
    handlers: PropTypes.object,
    stripes: PropTypes.shape({
      okapi: PropTypes.shape({
        tenant: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        url: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  WithFileHandlers.displayName = `WithFileHandlers(${getDisplayName(WrappedComponent)})`;
  return WithFileHandlers;
}
