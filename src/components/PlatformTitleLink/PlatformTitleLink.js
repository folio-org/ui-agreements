import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Icon,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';

const PlatformTitleLink = ({ id, pti = {} }) => {
  const platformName = pti.platform?.name;
  const ptiName = pti.name;
  const url = pti.url;

  if (!platformName && !url) return <NoValue />;

  return (
    <div>
      <div>{platformName ?? null}</div>
      { url ? (
        <Tooltip
          id={`tooltip-${id}`}
          placement="bottom"
          text={<FormattedMessage
            id="ui-agreements.eresources.accessTitleOnPlatform"
            values={{ name: ptiName }}
          />}
        >
          {({ ref, ariaIds }) => (
            <div
              ref={ref}
              aria-labelledby={ariaIds.text}
            >
              <a
                href={url}
                onClick={e => e.stopPropagation()}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon icon="external-link" iconPosition="end">
                  <FormattedMessage id="ui-agreements.eresources.titleOnPlatform" />
                </Icon>
              </a>
            </div>
          )}
        </Tooltip>) : null
      }
    </div>
  );
};

PlatformTitleLink.propTypes = {
  id: PropTypes.string,
  pti: PropTypes.shape({
    platform: PropTypes.shape({
      name: PropTypes.string,
    }),
    name: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default PlatformTitleLink;
