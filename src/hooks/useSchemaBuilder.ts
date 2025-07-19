import { useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { SchemaField, SchemaBuilderData, FieldType, DEFAULT_VALUES } from '@/types/schema';

export const useSchemaBuilder = (initialData?: SchemaBuilderData) => {
  const form = useForm<SchemaBuilderData>({
    defaultValues: initialData || { fields: [] },
    mode: 'onChange'
  });

  const schema = useWatch({
    control: form.control,
    name: 'fields',
    defaultValue: []
  });

  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const createField = useCallback((name: string = '', type: FieldType = 'string'): SchemaField => ({
    id: generateId(),
    name,
    type,
    value: type === 'nested' ? undefined : DEFAULT_VALUES[type],
    children: type === 'nested' ? [] : undefined,
  }), []);

  const updateField = useCallback((fieldId: string, updates: Partial<SchemaField>, parentPath?: string[]) => {
    const currentFields = form.getValues('fields');
    
    const updateFieldRecursive = (fields: SchemaField[]): SchemaField[] => {
      return fields.map(field => {
        if (field.id === fieldId) {
          const updatedField = { ...field, ...updates };
          // Handle type change
          if (updates.type && updates.type !== field.type) {
            if (updates.type === 'nested') {
              updatedField.children = [];
              updatedField.value = undefined;
            } else {
              updatedField.children = undefined;
              updatedField.value = DEFAULT_VALUES[updates.type];
            }
          }
          return updatedField;
        }
        if (field.children) {
          return { ...field, children: updateFieldRecursive(field.children) };
        }
        return field;
      });
    };

    const updatedFields = updateFieldRecursive(currentFields);
    form.setValue('fields', updatedFields, { shouldValidate: true });
  }, [form]);

  const addField = useCallback((parentPath?: string[]) => {
    const newField = createField();
    const currentFields = form.getValues('fields');
    
    if (!parentPath || parentPath.length === 0) {
      form.setValue('fields', [...currentFields, newField], { shouldValidate: true });
      return;
    }

    const addFieldRecursive = (fields: SchemaField[], path: string[], depth: number = 0): SchemaField[] => {
      if (depth === path.length - 1) {
        return fields.map(field => {
          if (field.id === path[depth] && field.children) {
            return { ...field, children: [...field.children, newField] };
          }
          return field;
        });
      }

      return fields.map(field => {
        if (field.id === path[depth] && field.children) {
          return { ...field, children: addFieldRecursive(field.children, path, depth + 1) };
        }
        return field;
      });
    };

    const updatedFields = addFieldRecursive(currentFields, parentPath);
    form.setValue('fields', updatedFields, { shouldValidate: true });
  }, [createField, form]);

  const deleteField = useCallback((fieldId: string) => {
    const currentFields = form.getValues('fields');
    
    const deleteFieldRecursive = (fields: SchemaField[]): SchemaField[] => {
      return fields
        .filter(field => field.id !== fieldId)
        .map(field => {
          if (field.children) {
            return { ...field, children: deleteFieldRecursive(field.children) };
          }
          return field;
        });
    };

    const updatedFields = deleteFieldRecursive(currentFields);
    form.setValue('fields', updatedFields, { shouldValidate: true });
  }, [form]);

  const generateJson = useCallback((): Record<string, any> => {
    const buildJsonRecursive = (fields: SchemaField[]): Record<string, any> => {
      const result: Record<string, any> = {};
      
      fields.forEach(field => {
        if (!field.name) return;
        
        if (field.type === 'nested' && field.children) {
          result[field.name] = buildJsonRecursive(field.children);
        } else {
          result[field.name] = field.value;
        }
      });
      
      return result;
    };

    return buildJsonRecursive(schema || []);
  }, [schema]);

  const onSubmit = (data: SchemaBuilderData) => {
    console.log('Schema submitted:', data);
  };

  return {
    schema: { fields: schema || [] },
    updateField,
    addField,
    deleteField,
    generateJson,
    createField,
    form,
    onSubmit,
  };
};