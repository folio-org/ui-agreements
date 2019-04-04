import { get } from 'lodash';
import isExternal from './isExternal';

export default function getResourceFromEntitlement(line = {}) {
  if (isExternal(line)) return line;

  const resource = get(line, ['resource', '_object', 'pti', 'titleInstance'], line.resource);
  if (resource) return resource;

  return { error: 'getResourceFromEntitlement: Failed to find resource' };
}
