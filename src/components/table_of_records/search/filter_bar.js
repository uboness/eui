import React from 'react';
import PropTypes from 'prop-types';
import { EuiFlexItem } from '../../flex/flex_item';
import { createFilter, FilterConfigType } from './filters';
import { Query } from './query';

export const FilterBarConfigType = PropTypes.arrayOf(FilterConfigType);

export const FilterBar = ({ query, onChange, config = [] }) => {
  return config.reduce((controls, filterConfig, index) => {
    if (filterConfig.available && !filterConfig.available()) {
      return controls;
    }
    const key = `filter_${index}`;
    const control = createFilter(index, filterConfig, query, onChange);
    controls.push(
      <EuiFlexItem key={key} grow={false}>
        {control}
      </EuiFlexItem>
    );
    return controls;
  }, []);
};

FilterBar.propTypes = {
  query: PropTypes.instanceOf(Query).isRequired,
  onChange: PropTypes.func.isRequired,
  config: FilterBarConfigType
};
