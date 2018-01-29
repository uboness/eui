import numeral from 'numeral';
import { isNil } from 'lodash';

const numberFormatAliases = {
  decimal1: '0,0.0',
  decimal2: '0,0.00',
  decimal3: '0,0.000',
  ordinal: '0o',
  integer: '0,0'
};

export const formatNumber = (value, { format, round, nil = '' } = {}) => {
  if (!format) {
    return isNil(value) ? nil : value.toString();
  }

  const roundingFunc = round ? Math.round : Math.floor;
  const numberFormat = numberFormatAliases[format] || format;
  return isNil(value) ? nil : numeral(value).format(numberFormat, roundingFunc);
};
