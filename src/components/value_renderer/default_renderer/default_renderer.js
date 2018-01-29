import { isArray, isBoolean, isDate, isNaN, isNil, isNumber, isString } from 'lodash';
import {
  formatBoolean,
  formatDate,
  formatNumber,
  formatText,
} from '../../../services';
import { join } from '../compound';

export const defaultRenderer = (value) => {
  if (isNil(value) || isNaN(value)) {
    return '';
  }
  if (isString(value)) {
    return formatText(value);
  }
  if (isDate(value)) {
    return formatDate(value);
  }
  if (isBoolean(value)) {
    return formatBoolean(value);
  }
  if (isNumber(value)) {
    return formatNumber(value);
  }
  if (isArray(value)) {
    return join(defaultRenderer)(value);
  }
  // TODO not sure if we want that.. the (+) is that we show something, the (-) is that it's very technical
  return JSON.stringify(value);
};
