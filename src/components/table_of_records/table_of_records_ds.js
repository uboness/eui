import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  EuiTableOfRecords, RecordIdType, ColumnType,
  SelectionType
} from './table_of_records';
import { Comparators } from '../../services/sort';

import {
  EuiTablePagination
} from '../table/table_pagination';

export const PaginationType = PropTypes.shape({
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number)
});

const ConfigType = PropTypes.shape({
  recordId: RecordIdType.isRequired,
  columns: PropTypes.arrayOf(ColumnType).isRequired,
  selection: SelectionType,
  pagination: PaginationType
});

const DataPropType = PropTypes.oneOfType([
  PropTypes.func, // (criteria) => Promise<{ records: [], totalRecordCount: number }>
  PropTypes.array
]);

const EuiTableOfRecordsDSProps = {
  config: ConfigType.isRequired,
  data: DataPropType.isRequired,
  refresh: PropTypes.func   // a function that will returned by EuiTableOfRecordsDS.createRefresher (see bellow)
};

export class EuiTableOfRecordsDS extends React.Component {

  static propTypes = EuiTableOfRecordsDSProps;

  static createRefresher() {
    const registry = {};
    function refresh() {
      if (registry.listener) {
        registry.listener();
      }
    }
    refresh.listen = function (listener) {
      registry.listener = listener;
    };
    return refresh;
  }

  constructor(props) {
    super(props);
    this.loadData = _.isFunction(this.props.data) ? this.props.data : EuiTableOfRecordsDS.createDataLoader(this.props.data);
    if (props.refresh) {
      props.refresh.listen(() => this.refresh());
    }
    this.state = {
      data: {
        records: [],
        totalRecordCount: 0
      },
      criteria: {
        page: {
          index: 0,
          size: EuiTableOfRecordsDS.resolveDefaultPageSize(this.props.config)
        },
        sort: null
      }
    };
  }

  static createDataLoader(allRecords) {
    return (criteria) => {
      let list = allRecords;
      if (criteria.sort) {
        list = allRecords.sort(Comparators.property(criteria.sort.key, criteria.sort.direction));
      }
      const pageSize = criteria.page.size;
      const pageIndex = criteria.page.index;
      const from = pageIndex * pageSize;
      const records = list.slice(from, Math.min(from + pageSize, list.length));
      return Promise.resolve({
        records,
        totalRecordCount: list.length
      });
    };
  }

  static resolveDefaultPageSize(config) {
    if (!config.pagination || !config.pagination.pageSize) {
      return EuiTablePagination.defaultProps.itemsPerPage;
    }
    return config.pagination.pageSize;
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    this.updateData(this.state.criteria);
  }

  updateData(criteria) {
    this.loadData(criteria).then(data => {
      this.setState({ data, criteria });
    }).catch(error => {
      //todo  pass the error to the table so it'll show it.
      //todo  (we'll have to add support for it in the table)
      throw new Error(error);
    });
  }

  render() {

    const config = {
      recordId: this.props.config.recordId,
      columns: this.props.config.columns,
      pagination: this.props.config.pagination,
      selection: this.props.config.selection,
      onDataCriteriaChange: (criteria) => this.updateData(criteria)
    };

    return (
      <EuiTableOfRecords config={config} model={this.state}/>
    );
  }


}
