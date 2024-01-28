import _ from 'lodash'

export function iterateObject(obj: { [key: string]: any }, callback: (key:  { [key: string]: any }, value: any, path: string) => void, basePath: string = ''): void {
  Object.entries(obj).forEach(([key, value]) => {
    const currentPath = basePath ? `${basePath}.${key}` : key;

    // If the value is an object (but not an array or null), recurse
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      iterateObject(value, callback, currentPath);
    } else {
      // Call the callback for every non-object value
      callback(obj, key, currentPath);
    }
  });
}

export function findDifferences(obj1: Record<string, any>, obj2: Record<string, any>, basePath: string = ''): string[] {
  let differences: string[] = [];

  // Iterate through keys in the first object
  _.forEach(obj1, (value, key) => {
    const currentPath = basePath ? `${basePath}.${key}` : key;

    // Check if the key also exists in the second object
    if (_.has(obj2, key)) {
      if (_.isObject(value) && _.isObject(obj2[key])) {
        // If both values are objects, recurse
        differences = differences.concat(findDifferences(value, obj2[key], currentPath));
      } else if (!_.isEqual(value, obj2[key])) {
        // If values are different and not objects, add the key to differences
        differences.push(currentPath);
      }
    } else {
      // Key doesn't exist in the second object, so add it to differences
      differences.push(currentPath);
    }
  });

  // Iterate through keys in the second object to find keys not present in the first object
  _.forEach(obj2, (value, key) => {
    const currentPath = basePath ? `${basePath}.${key}` : key;

    if (!_.has(obj1, key)) {
      differences.push(currentPath);
    }
  });

  return differences;
}