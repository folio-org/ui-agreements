import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, TextField } from '@folio/stripes/components';

export default class CreateOrganizationModal extends React.Component {
  static manifest = Object.freeze({
    organizations: {
      type: 'okapi',
      path: 'erm/org',
      fetch: false,
      accumulate: true,
    }
  });

  static propTypes = {
    mutator: PropTypes.shape({
      organizations: PropTypes.shape({
        GET: PropTypes.func,
        POST: PropTypes.func,
        reset: PropTypes.func,
      })
    }),
    open: PropTypes.bool,
    onClose: PropTypes.func,
  }

  state = {
    error: null,
    name: '',
  }

  createOrganization = () => {
    const { mutator: { organizations } } = this.props;

    this.setState({ error: null });

    organizations.reset();
    organizations
      .GET({ params: { match: 'name', term: this.state.name } })
      .then(results => {
        if (!results || results.length) {
          this.setState({ error: <FormattedMessage id="ui-agreements.organizations.alreadyExists" /> });
        } else {
          organizations
            .POST({ name: this.state.name })
            .then(() => { this.props.onClose(); })
            .catch(error => this.setState({ error }));
        }
      })
      .catch(error => this.setState({ error }));
  }

  render() {
    return (
      <Modal
        dismissible
        label={<FormattedMessage id="ui-agreements.organizations.createNew" />}
        onClose={this.props.onClose}
        open={this.props.open}
        size="small"
      >
        <TextField
          error={this.state.error}
          label={<FormattedMessage id="ui-agreements.organizations.name" />}
          onChange={e => this.setState({ name: e.target.value })}
        />
        <Button
          buttonStyle="primary"
          disabled={!this.state.name}
          onClick={e => {
            e.preventDefault();
            this.createOrganization();
          }}
        >
          <FormattedMessage id="ui-agreements.organizations.createNew" />
        </Button>
      </Modal>
    );
  }
}
