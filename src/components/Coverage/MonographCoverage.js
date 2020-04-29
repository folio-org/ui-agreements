import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Layout } from '@folio/stripes/components';

export default class MonographCoverage extends React.Component {
  static propTypes = {
    pci: PropTypes.shape({
      pti: PropTypes.shape({
        titleInstance: PropTypes.shape({
          dateMonographPublished: PropTypes.string,
          monographVolume: PropTypes.string,
          monographEdition: PropTypes.string,
          name: PropTypes.string
        }),
      }).isRequired
    }),
  }

  renderEdition(edition) {
    if (!edition) return null;

    return (
      <>
        <FormattedMessage id="ui-agreements.coverage.editionShort" />
        {edition}
      </>
    );
  }

  renderVolume(volume) {
    if (!volume) return null;

    return (
      <>
        <FormattedMessage id="ui-agreements.coverage.volumeShort" />
        {volume}
      </>
    );
  }

  renderCoverage(pci) {
    const date = pci?.pti?.titleInstance?.dateMonographPublished;
    const volume = pci?.pti?.titleInstance?.monographVolume;
    const edition = pci?.pti?.titleInstance?.monographEdition;

    if (!date && !volume && !edition) {
      return '*';
    }

    return (
      <Layout
        className="full"
        data-test-start
      >
        <div data-test-date={date}>
          { date }
        </div>
        <div
          data-test-edition={edition}
          data-test-volume={volume}
        >
          {this.renderEdition(edition)}
          {volume && edition ? <>&nbsp;</> : null}
          {this.renderVolume(volume)}
        </div>
      </Layout>
    );
  }

  render() {
    const { pci } = this.props;
    const titleName = pci?.pti?.titleInstance?.name;

    if (!pci) return null;

    return (
      <Layout className="full" data-test-monograph-coverage={titleName}>
        {this.renderCoverage(pci)}
      </Layout>
    );
  }
}
