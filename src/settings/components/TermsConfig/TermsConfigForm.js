import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { FieldArray } from 'react-final-form-arrays';

import { Callout, Pane } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import TermsConfigListFieldArray from './TermsConfigListFieldArray';

class TermsConfigForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      terms: PropTypes.arrayOf(PropTypes.object),
    }),
    form: PropTypes.shape({
      mutators: PropTypes.object.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  sendCallout = (operation, outcome, error = '') => {
    this.callout.sendCallout({
      type: outcome,
      message: <FormattedMessage id={`ui-licenses.settings.terms.callout.${operation}.${outcome}`} values={{ error }} />,
      timeout: error ? 0 : undefined, // Don't autohide callouts with a specified error message.
    });
  }

  sendCalloutTermInUse = () => {
    this.callout.sendCallout({
      type: 'error',
      message: <SafeHTMLMessage id="ui-licenses.settings.terms.callout.delete.termInUse" />,
      timeout: 0,
    });
  }

  handleDelete = (...rest) => {
    return this.props.onDelete(...rest)
      .then(() => this.sendCallout('delete', 'success'))
      .catch(response => {
        // Attempt to show an error message if we got JSON back with a message.
        // If json()ification fails, show the generic error callout.
        response.json()
          .then((error) => {
            const pattern = new RegExp('violates foreign key constraint.*is still referenced from table', 's');
            if (pattern.test(error.message)) {
              this.sendCalloutTermInUse();
            } else {
              this.sendCallout('delete', 'error', error.message);
            }
          })
          .catch(() => this.sendCallout('delete', 'error'));

        // Return a rejected promise to break any downstream Promise chains.
        return Promise.reject();
      });
  }

  handleSave = (...rest) => {
    return this.props.onSave(...rest)
      .then(() => this.sendCallout('save', 'success'))
      .catch(response => {
        // Attempt to show an error message if we got JSON back with a message.
        // If json()ification fails, show the generic error callout.
        response.json()
          .then(error => this.sendCallout('save', 'error', error.message))
          .catch(() => this.sendCallout('save', 'error'));

        // Return a rejected promise to break any downstream Promise chains.
        return Promise.reject();
      });
  }

  render() {
    const {
      form: { mutators },
    } = this.props;

    const count = get(this.props, 'initialValues.terms.length', 0);

    return (
      <Pane
        defaultWidth="fill"
        id="settings-terms"
        paneTitle={<FormattedMessage id="ui-licenses.section.terms" />}
        paneSub={<FormattedMessage id="ui-licenses.settings.terms.termCount" values={{ count }} />}
      >
        <form>
          <FieldArray
            component={TermsConfigListFieldArray}
            mutators={mutators}
            name="terms"
            onDelete={this.handleDelete}
            onSave={this.handleSave}
          />
        </form>
        <Callout ref={ref => { this.callout = ref; }} />
      </Pane>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
  mutators: {
    setTermValue: (args, state, tools) => {
      tools.changeValue(state, args[0], () => args[1]);
    },
  },
  navigationCheck: true,
})(TermsConfigForm);
