import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from '../';

export const EuiHealth = ({
  children,
  className,
  color,
  ...rest,
}) => {
  const classes = classNames('euiHealth', className);

  return (
    <div
      className={classes}
      {...rest}
    >
      <EuiFlexGroup gutterSize="xs" alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiIcon type="dot" color={color} />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          {children}
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};

EuiHealth.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
