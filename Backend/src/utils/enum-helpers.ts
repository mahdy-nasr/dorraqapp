export function getKeyByEnumValue<T extends Record<string, string>>(
  enumType: T,
  value: string
): keyof T | undefined {
  const keys = Object.keys(enumType) as Array<keyof T>;
  return keys.find((key) => enumType[key] === value);
}
