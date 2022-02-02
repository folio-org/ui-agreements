import invert from 'lodash/invert';
import { FormattedMessage } from 'react-intl';

import { ACQUISITION_METHOD } from '@folio/stripes-acq-components';

export const getTranslatedAcqMethod = (value = []) => {
  const acqMethodsMap = invert(ACQUISITION_METHOD);
  return (
    <FormattedMessage
      defaultMessage={value}
      id={`stripes-acq-components.acquisition_method.${acqMethodsMap[value]}`}
    />
  );
};

export default getTranslatedAcqMethod;
