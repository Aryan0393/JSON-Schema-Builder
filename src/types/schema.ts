export type FieldType = 'string' | 'number' | 'nested';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  value?: string | number;
  children?: SchemaField[];
}

export interface SchemaBuilderData {
  fields: SchemaField[];
}

export const DEFAULT_VALUES = {
  string: "Sample String",
  number: 42,
  nested: {}
} as const;