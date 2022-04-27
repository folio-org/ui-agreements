import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, useFormState, useForm } from 'react-final-form';
import { Link } from 'react-router-dom';

import {
  RadioButton,
  RadioButtonGroup,
  Tooltip,
  Button,
  Card,
  Layout,
  KeyValue,
  Row,
  Col,
  Headline,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';
import css from '../../../styles.css';
import { urls } from '../../../utilities';

const DestinationTitlePreview = ({}) => {

  const { initialValues, values } = useFormState();
  const initialDestinationTI = initialValues?.destinationTI?.ti._object;
  const [destinationTI, setDestinationTI] = useState(initialDestinationTI ?? {});

  return (
    <Card
      cardStyle="positive"
      headerStart={(
        <AppIcon app="agreements" iconKey="eresource" size="small">
          <strong>
            {destinationTI.id ?
              <Link target="_blank" to={urls.eresourceView(destinationTI?.id)}>
                {destinationTI?.id ? destinationTI?.name : <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
              </Link>
                  :
              <FormattedMessage id="ui-agreements.eresource.moveIdetifiers.title" /> }
          </strong>
        </AppIcon>
      )}
      roundedBorder
    >
      PREVIEW CARD
    </Card>
  );
};

export default DestinationTitlePreview;
