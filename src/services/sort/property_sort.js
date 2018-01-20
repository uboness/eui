import PropTypes from 'prop-types';
import { SortDirectionType } from './sort_direction';

export const PropertySortType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  direction: SortDirectionType.isRequired
});
