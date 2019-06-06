import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';

import { DocumentsFieldArray } from '@folio/stripes-erm-components';

export default class AgreementFormSupplementaryInfo extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onDeleteFile: PropTypes.func.isRequired,
      onDownloadFile: PropTypes.func.isRequired,
      onUploadFile: PropTypes.func.isRequired,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { handlers } = this.props;
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.supplementaryInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-agreements.supplementaryInfo.addSupplementaryInfo" />}
          component={DocumentsFieldArray}
          onDeleteFile={handlers.onDeleteFile}
          onDownloadFile={handlers.onDownloadFile}
          onUploadFile={handlers.onUploadFile}
          isEmptyMessage={<FormattedMessage id="ui-agreements.supplementaryInfo.agreementHasNone" />}
          name="supplementaryDocs"
        />
      </Accordion>
    );
  }
}
