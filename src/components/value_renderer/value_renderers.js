import { text } from './text';
import { property, join } from './compound';
import { defaultRenderer } from './default_renderer';

export const EuiValueRenderers = {
  default: defaultRenderer,
  text,
  property,
  join
};
