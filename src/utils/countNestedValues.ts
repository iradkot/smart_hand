import _ from 'lodash';

interface NestedObject {
  type?: string;
  children?: Record<string, NestedObject>; // children is optional and recursive type
}

function countNestedValues<T extends NestedObject>(obj: T, targetValue: any): number {
  let count = 0;

  function countValues(o: NestedObject | undefined) {
    if (o && typeof o === 'object') {
      if (o.type === targetValue) {
        count++;
      }

      const children = o.children || {};  // Set a default empty object if undefined
      _.forOwn(children, (child) => {
        countValues(child);
      });
    }
  }

  countValues(obj);
  return count;
}

export default countNestedValues;
