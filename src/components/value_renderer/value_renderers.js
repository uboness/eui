import { text } from './text';
import { number } from './number';
import { booleanText, booleanIcon } from './boolean';
import { property, join } from './compound';
import { defaultRenderer } from './default_renderer';

export const EuiValueRenderers = {
  default: defaultRenderer,
  text,
  number,
  booleanText,
  booleanIcon,
  property,
  join
};
