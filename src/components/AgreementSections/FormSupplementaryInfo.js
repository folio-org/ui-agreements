import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion, KeyValue } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

import FormCustomProperties from './FormCustomProperties';

export default class FormSupplementaryInfo extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    handlers: PropTypes.shape({
      onDownloadFile: PropTypes.func.isRequired,
      onUploadFile: PropTypes.func.isRequired,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { data, id, handlers, onToggle, open } = this.props;
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.supplementaryInfo" />}
        open={open}
        onToggle={onToggle}
      >
        <KeyValue label={<FormattedMessage id="ui-agreements.supplementaryInfo.supplementaryProperties" />}>
          <FormCustomProperties data={data} />
        </KeyValue>
        <KeyValue label={<FormattedMessage id="ui-agreements.supplementaryInfo.supplementaryDocuments" />}>
          <FieldArray
            addDocBtnLabel={<FormattedMessage id="ui-agreements.supplementaryInfo.addSupplementaryInfo" />}
            component={DocumentsFieldArray}
            deleteBtnTooltipMsgId="ui-agreements.doc.removeSupplementaryInformation"
            onDownloadFile={handlers.onDownloadFile}
            onUploadFile={handlers.onUploadFile}
            isEmptyMessage={<FormattedMessage id="ui-agreements.supplementaryInfo.agreementHasNone" />}
            name="supplementaryDocs"
          />
        </KeyValue>
      </Accordion>
    );
  }
}
