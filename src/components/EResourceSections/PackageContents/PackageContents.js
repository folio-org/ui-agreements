import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Button,
  ButtonGroup,
  FormattedUTCDate,
  Layout,
  MultiColumnList,
  Spinner,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { TitleOnPlatformLink, usePrevNextPagination } from '@folio/stripes-erm-components';
import Coverage from '../../Coverage';
import EResourceLink from '../../EResourceLink';
import { PACKAGE_CONTENT_PAGINATION_ID, resultCount } from '../../../constants';
import { parseMclPageSize } from '../../utilities';
import { useAgreementsSettings } from '../../../hooks';

const { RESULT_COUNT_INCREMENT } = resultCount;

const propTypes = {
  data: PropTypes.shape({
    areContentsLoading: PropTypes.bool,
    eresource: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    packageContents: PropTypes.arrayOf(PropTypes.object),
    packageContentsCount: PropTypes.number,
    packageContentsFilter: PropTypes.string,
    searchString: PropTypes.string
  }),
  id: PropTypes.string,
  onFilterPackageContents: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const PackageContents = ({
  data: {
    eresource: { id: eresourceId },
    areContentsLoading,
    packageContents,
    packageContentsCount,
    packageContentsFilter,
    searchString
  },
  id,
  isLoading,
  onFilterPackageContents
}) => {
  const settings = useAgreementsSettings();
  const packageContentsPageSize = parseMclPageSize(settings, 'packageContents');

  const renderDate = date => (date ? <FormattedUTCDate value={date} /> : '');

  const renderBadge = () => {
    const count = packageContentsCount ?? 0;
    return (count !== undefined && !isLoading) ? <Badge>{count}</Badge> : <Spinner />;
  };

  const {
    paginationMCLProps,
  } = usePrevNextPagination({
    count: packageContentsCount,
    pageSize: packageContentsPageSize,
    id: `${PACKAGE_CONTENT_PAGINATION_ID}-${eresourceId}`,
    syncToLocation: false
  });

  const renderList = () => {
    return (
      <MultiColumnList
        columnMapping={{
          name: <FormattedMessage id="ui-agreements.eresources.name" />,
          platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
          coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
          accessStart: <FormattedMessage id="ui-agreements.eresources.accessStart" />,
          accessEnd: <FormattedMessage id="ui-agreements.eresources.accessEnd" />,
        }}
        columnWidths={{
          name: { min: 200, max: 400 },
          coverage: { min: 250, max: 320 },
        }}
        contentData={packageContents}
        formatter={{
          name: pci => {
            return (
              <AppIcon
                app="agreements"
                iconAlignment="baseline"
                iconKey="pci"
                size="small"
              >
                <EResourceLink eresource={pci.pti.titleInstance} searchString={searchString} />
              </AppIcon>
            );
          },
          platform: pci => {
            const pti = pci.pti ?? {};
            const { name, platform, url } = pti;

            return (
              <TitleOnPlatformLink
                id={pci.id}
                name={name}
                platform={platform?.name}
                url={url}
              />
            );
          },
          coverage: pci => <Coverage pci={pci} />,
          accessStart: pci => renderDate(pci.accessStart),
          accessEnd: pci => renderDate(pci.accessEnd),
        }}
        id="package-contents-list"
        interactive={false}
        pageAmount={RESULT_COUNT_INCREMENT}
        pagingType="click"
        totalCount={packageContentsCount}
        visibleColumns={['name', 'platform', 'coverage', 'accessStart', 'accessEnd']}
        {...paginationMCLProps}
      />
    );
  };

  const renderFilterButton = (filter) => (
    <Button
      buttonStyle={
        packageContentsFilter === filter ? 'primary' : 'default'
      }
      id={`clickable-pci-${filter}`}
      onClick={() => onFilterPackageContents(filter)}
    >
      <FormattedMessage id={`ui-agreements.content.${filter}`} />
    </Button>
  );

  const renderFilterButtons = () => (
    <Layout className="textCentered">
      <ButtonGroup>
        {renderFilterButton('current')}
        {renderFilterButton('future')}
        {renderFilterButton('dropped')}
        {renderFilterButton('all')}
      </ButtonGroup>
    </Layout>
  );

  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={renderBadge()}
      id={id}
      label={
        <FormattedMessage id="ui-agreements.eresources.packageResources" />
      }
    >
      {renderFilterButtons()}
      {(packageContents && !areContentsLoading) ? (
        renderList()
      ) : (
        <Spinner />
      )}
    </Accordion>
  );
};

PackageContents.propTypes = propTypes;
export default PackageContents;
