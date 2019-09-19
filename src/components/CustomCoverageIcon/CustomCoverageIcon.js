import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Layout } from '@folio/stripes/components';

const CustomCoverage = React.forwardRef((props, ref) => (
    <FormattedMessage id="ui-agreements.agreementLines.hasCustomCoverage">
      {(customCoverage) => (
        <Layout
          className="flex"
          data-test-custom-coverage
          aria-label={customCoverage}
        >
          <svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.23 4.23" ref={ref}>
            <g transform="translate(-4.26,-288.64)" style={{ display: 'none' }}>
              <path style={{ fill: 'none', stroke: '#787878', strokeWidth: 1.02, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} d="M 1.48,296.11 1.44,285.58" />
              <rect style={{ opacity: 1, fill: '#008000', fillOpacity: 1, stroke: '#008000', strokeWidth: 0.79, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} width="1.94" height="1.94" x="0.44" y="294.65" ry="0.73" />
              <rect style={{ opacity: 1, fill: '#008000', fillOpacity: 1, stroke: '#008000', strokeWidth: 1.13, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} width="2.76" height="2.76" x="9.37" y="284.87" ry="1.04" />
              <rect style={{ opacity: 1, fill: '#787878', fillOpacity: 1, stroke: '#787878', strokeWidth: 0.80, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} width="1.96" height="1.96" x="0.44" y="285.77" ry="0.74" />
              <path style={{ fill: 'none', stroke: '#008000', strokeWidth: 0.97, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 1.29,294.94 c 0.69,-4.42 9.35,-2.85 9.54,-6.61" />
            </g>
            <g style={{ display: 'inline' }} transform="translate(-4.26,-288.64)">
              <path d="m 4.75,292.57 -0.01,-2.94" style={{ fill: 'none', stroke: '#787878', strokeWidth: 0.31, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
              <path d="m 4.72,292.17 c 0.10,-1.69 3.08,-1.00 3.14,-2.31" style={{ fill: 'none', stroke: '#008000', strokeWidth: 0.33, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
              <ellipse style={{ opacity: 1, fill: '#787878', fillOpacity: 1, stroke: 'none', strokeWidth: 0.43, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 0.07 }} cx="4.74" cy="289.77" rx="0.48" ry="0.48" />
              <ellipse style={{ display: 'inline', opacity: 1, fill: '#008000', fillOpacity: 1, stroke: 'none', strokeWidth: 0.43, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 0.07 }} cx="4.74" cy="292.38" rx="0.48" ry="0.48" />
              <ellipse style={{ opacity: 1, fill: '#008000', fillOpacity: 1, stroke: 'none', strokeWidth: 0.38, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 0.07 }} cx="7.86" cy="289.28" rx="0.63" ry="0.64" />
            </g>
            <g transform="translate(-4.26,-288.64)" style={{ display: 'none' }}>
              <path d="M 1.88,295.76 1.84,285.23" style={{ fill: 'none', stroke: '#787878', strokeWidth: 1.02, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
              <rect ry="1.04" y="284.87" x="9.37" height="2.76" width="2.76" style={{ opacity: 1, fill: '#008000', fillOpacity: 1, stroke: '#008000', strokeWidth: 1.13, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
              <rect ry="0.74" y="285.41" x="0.84" height="1.96" width="1.96" style={{ opacity: 1, fill: '#787878', fillOpacity: 1, stroke: '#787878', strokeWidth: 0.80, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
              <path d="m 1.85,293.20 c 0.65,-3.25 8.81,-2.10 8.99,-4.87" style={{ fill: 'none', stroke: '#008000', strokeWidth: 1.01, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
              <rect ry="1.04" y="293.72" x="0.53" height="2.76" width="2.76" style={{ opacity: 1, fill: '#008000', fillOpacity: 1, stroke: '#008000', strokeWidth: 1.13, strokeLinecap: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            </g>
          </svg>
        </Layout>
      )}
    </FormattedMessage>
));

export default CustomCoverage