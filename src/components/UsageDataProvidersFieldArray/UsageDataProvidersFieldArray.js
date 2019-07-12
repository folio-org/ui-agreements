import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { Button, Layout, TextArea } from '@folio/stripes/components';
import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import UsageDataProviderField from './UsageDataProviderField';

class UsageDataProvidersFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onReplaceField: PropTypes.func.isRequired,
  };

  state = {
    udps: {},
  }

  handleUDPSelected = (index, udp) => {
    this.props.onReplaceField(index, { remoteId: udp.id });

    this.setState(prevState => ({
      udps: {
        ...prevState.udps,
        [udp.id]: udp,
      }
    }));
  }

  handleUDPUnselected = (index) => {
    this.props.onReplaceField(index, { remoteId: null });
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter" data-test-udp-empty-message>
      <FormattedMessage id="ui-agreements.usageData.agreementHasNone" />
    </Layout>
  );

  renderUDPFields = (items) => {
    return items.map((udp, index) => (
      <EditCard
        header={<FormattedMessage id="ui-agreements.usageData.usageDataProviderIndex" values={{ index: index + 1 }} />}
        id={`edit-udp-card-${index}`}
        key={index}
        onDelete={() => this.props.onDeleteField(index, udp)}
      >
        <Field
          component={UsageDataProviderField}
          id={`udp-remoteId-${index}`}
          index={index}
          name={`${this.props.name}[${index}].remoteId`}
          onUDPSelected={selectedUDP => this.handleUDPSelected(index, selectedUDP)}
          onUDPUnselected={() => this.handleUDPUnselected(index)}
          udp={this.state.udps[udp.remoteId] || udp.remoteId_object}
        />
        <Field
          component={TextArea}
          id={`udp-note-${index}`}
          label={<FormattedMessage id="ui-agreements.usageData.note" />}
          name={`${this.props.name}[${index}].usageDataProviderNote`}
        />
      </EditCard>
    ));
  }

  render() {
    const { items, onAddField } = this.props;
    return (
      <div data-test-udp-fa>
        <div>
          {items.length ? this.renderUDPFields(items) : this.renderEmpty()}
        </div>
        <Button
          data-test-udp-fa-add-button
          onClick={() => onAddField({})}
          id="add-udp-btn"
        >
          <FormattedMessage id="ui-agreements.usageData.addUDP" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(UsageDataProvidersFieldArray);
