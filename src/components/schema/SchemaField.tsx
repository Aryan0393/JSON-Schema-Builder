import React from 'react';
import { Trash2, Plus, Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { SchemaField as SchemaFieldType, FieldType } from '@/types/schema';

interface SchemaFieldProps {
  field: SchemaFieldType;
  depth: number;
  onUpdate: (fieldId: string, updates: Partial<SchemaFieldType>) => void;
  onDelete: (fieldId: string) => void;
  onAddChild: (parentPath: string[]) => void;
  parentPath: string[];
}

const TYPE_COLORS = {
  string: 'bg-blue-50 border-blue-200 text-blue-700',
  number: 'bg-green-50 border-green-200 text-green-700',
  nested: 'bg-purple-50 border-purple-200 text-purple-700'
} as const;

export const SchemaField: React.FC<SchemaFieldProps> = ({
  field,
  depth,
  onUpdate,
  onDelete,
  onAddChild,
  parentPath
}) => {
  const currentPath = [...parentPath, field.id];
  const marginLeft = depth * 24;

  const handleNameChange = (value: string) => {
    onUpdate(field.id, { name: value });
  };

  const handleTypeChange = (type: FieldType) => {
    onUpdate(field.id, { type });
  };

  const handleAddNestedField = () => {
    onAddChild(currentPath);
  };

  return (
    <div className="space-y-2">
      <Card 
        className="p-4 transition-all duration-200 hover:shadow-md bg-gradient-to-r from-card to-muted/20"
        style={{ marginLeft }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-grab">
            <Grip className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Field name"
                value={field.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="w-32">
              <Select value={field.type} onValueChange={handleTypeChange}>
                <SelectTrigger className={`${TYPE_COLORS[field.type]} border-2`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="nested">Nested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {field.type === 'nested' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddNestedField}
                  className="text-schema-primary border-schema-primary/30 hover:bg-schema-primary/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(field.id)}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {field.type !== 'nested' && (
          <div className="mt-3 pl-8">
            <div className="text-sm text-muted-foreground">
              Default value: <span className="font-mono bg-muted px-2 py-1 rounded">
                {typeof field.value === 'string' ? `"${field.value}"` : field.value}
              </span>
            </div>
          </div>
        )}
      </Card>

      {field.type === 'nested' && field.children && field.children.length > 0 && (
        <div className="space-y-2 relative">
          <div 
            className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-schema-primary/30 to-transparent"
            style={{ marginLeft }}
          />
          {field.children.map((child) => (
            <SchemaField
              key={child.id}
              field={child}
              depth={depth + 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              parentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};