import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';
import { Field, FormSpy } from 'react-final-form';
import { Card, Col, Headline, MessageBanner, KeyValue, Row, Select, TextArea } from '@folio/stripes/components';
import { LicenseEndDate, withKiwtFieldArray } from '@folio/stripes-erm-components';

import { urls, validators } from '../utilities';
import { statuses } from '../../constants';
import FormattedUTCDate from '../FormattedUTCDate';

class AmendmentsFieldArray extends React.Component {
  static propTypes = {
    amendmentStatusValues: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.shape({
      mutators: PropTypes.shape({
        setFieldData: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    license: PropTypes.shape({
      amendments: PropTypes.arrayOf(PropTypes.shape({
        endDate: PropTypes.string,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startDate: PropTypes.string,
        status: PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }).isRequired,
      })),
    }),
    name: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { statusWarnings: [] };

    if(props.items) {
      if(props.items.length){
        for(var i=0; i < props.items.length; i++){
          this.state.statusWarnings[i] = { warningId: "", warningValuesStatus: null};
        }
      }
    }
  }

  RenderWarningStatus(id, valuesStatus) {
    if(!id) {
      return null;
    } else {
      if(!valuesStatus) {
        return(
          <MessageBanner type="warning">
            <FormattedMessage id={id} />
          </MessageBanner>
        );
      } else {
        return(
          <MessageBanner type="warning">
            <FormattedMessage id={id} values={{status: `${valuesStatus}`}} />
          </MessageBanner>
        );
      }
    }
  }



  /* warnStatusMismatch = ({ values }) => {
    const { form, name } = this.props;

    get(values, name, []).forEach((field, i) => {
      const { amendmentId, status = {} } = field;

      const statusString = typeof status === 'string' ? status : status.value;
      if (!statusString || statusString !== statuses.CURRENT) {
        form.mutators.setFieldData(`${name}[${i}].status`, { warning: undefined });
        return;
      }

      const amendment = get(this.props.license, 'amendments', []).find(a => a.id === amendmentId);

      let warning;
      
      // Amendment start date is in the future
      if (new Date(amendment.startDate).getTime() > new Date().getTime()) {
        warning = <MessageBanner type="warning"> <FormattedMessage id="ui-agreements.license.warn.amendmentFuture" /> </MessageBanner>;
      }

      // Amendment end date is in the past
      if (new Date(amendment.endDate).getTime() < new Date().getTime()) {
        warning = <MessageBanner type="warning"> <FormattedMessage id="ui-agreements.license.warn.amendmentPast" /> </MessageBanner>;
      }

      // Amendment has an invalid status.
      const linkedStatus = get(amendment, 'status', {});
      if (linkedStatus.value === statuses.EXPIRED || linkedStatus.value === statuses.REJECTED) {
        warning = <MessageBanner type="warning"><FormattedMessage id="ui-agreements.license.warn.amendmentStatus" values={{ status: linkedStatus.label }} /> </MessageBanner>;
      }

      form.mutators.setFieldData(`${name}[${i}].status`, { warning });
    });
  } */
  

  render() {
    const {
      amendmentStatusValues,
      items,
      license = {},
      name
    } = this.props;
    var { statusWarnings } = this.state;
    const { amendments = [] } = license;
    if (!items.length) {
      return null;
    }
    console.log("statusWarnings: %o", statusWarnings)
    return (
      <div data-test-amendments-fa>
        <Headline>
          <FormattedMessage id="ui-agreements.license.licenseAmendments" />
        </Headline>
        {items.map((item, i) => {

          {console.log("Status Warning Id: %o", statusWarnings[i].warningId, "Status Warning Value Status: %o", statusWarnings[i].warningValuesStatus )}
          const amendment = amendments.find(a => item.amendmentId === a.id) || {};
          return (
            <Card
              data-test-amendment={amendment.name}
              headerStart={
                <Link
                  data-test-amendment-name
                  to={urls.amendmentView(license.id, amendment.id)}
                >
                  <strong>{amendment.name}</strong>
                </Link>
              }
              key={amendment.id}
            >
              <Row>
                <Col xs={12} md={4}>
                  <KeyValue
                    data-test-amendment-status
                    label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
                    value={get(amendment, 'status.label', '-')}
                  />
                </Col>
                <Col xs={6} md={4}>
                  <KeyValue
                    data-test-amendment-start-date
                    label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
                  >
                    {amendment.startDate ? <FormattedUTCDate value={amendment.startDate} /> : '-'}
                  </KeyValue>
                </Col>
                <Col xs={6} md={4}>
                  <KeyValue
                    data-test-amendment-end-date
                    label={<FormattedMessage id="ui-agreements.agreements.endDate" />}
                  >
                    <LicenseEndDate license={amendment} />
                  </KeyValue>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4}>
                <Field
                    name={`${name}[${i}].status`}
                    validate={validators.required}
                  >
                    {props => (
                      <Select
                        {...props}
                        dataOptions={amendmentStatusValues}
                        label={<FormattedMessage id="ui-agreements.license.prop.status" />}
                        onChange={(e) => {
                          const { value } = e.target;
                          let warning;
                          let warningValuesStatus;

                          if (value === statuses.CURRENT) {
                            if (new Date(amendment.startDate).getTime() > new Date().getTime()) {
                              warning = "ui-agreements.license.warn.amendmentFuture"
                            }
                            // Amendment end date is in the past
                            if (new Date(amendment.endDate).getTime() < new Date().getTime()) {
                              warning = "ui-agreements.license.warn.amendmentPast"
                            }
                            // Amendment has an invalid status.
                            const linkedStatus = get(amendment, 'status', {});
                            if (linkedStatus.value === statuses.EXPIRED || linkedStatus.value === statuses.REJECTED) {
                              warning = "ui-agreements.license.warn.amendmentStatus"
                              warningValuesStatus = linkedStatus.label
                            }
                          }
                          //this.props.form.mutators.setFieldData(`${name}[${i}].status`, { warning });
                          statusWarnings[i].warningId = warning
                          statusWarnings[i].warningValuesStatus = warningValuesStatus
                          props.input.onChange(e);
                        }}
                        placeholder=" "
                        required
                      />
                    )}
                  </Field>
                </Col>
                <Col xs={12} md={8}>
                  <Field
                    component={TextArea}
                    label={<FormattedMessage id="ui-agreements.license.amendmentNote" />}
                    name={`${name}[${i}].note`}
                  />
                </Col>
              </Row>
                { this.RenderWarningStatus(statusWarnings[i].warningId, statusWarnings[i].warningValuesStatus) }
              {/* <FormSpy
                subscription={{ values: true }}
                onChange={this.warnStatusMismatch}
              /> */}
            </Card>
          );
        })}
      </div>
    );
  }
}

export default withKiwtFieldArray(AmendmentsFieldArray);
