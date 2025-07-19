import React from 'react';
import { Plus, Settings, FileJson, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { SchemaField } from './SchemaField';
import { JsonPreview } from './JsonPreview';
import { useSchemaBuilder } from '@/hooks/useSchemaBuilder';

export const SchemaBuilder: React.FC = () => {
  const {
    schema,
    updateField,
    addField,
    deleteField,
    generateJson,
    form,
    onSubmit,
  } = useSchemaBuilder();

  const jsonData = generateJson();
  const fieldCount = schema.fields.length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-schema-secondary/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-r from-schema-primary to-purple-600 rounded-xl shadow-lg">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-schema-primary to-purple-600 bg-clip-text text-transparent">
                JSON Schema Builder
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create dynamic JSON schemas with nested structures. Add, edit, and organize fields with real-time preview.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Settings className="h-3 w-3 mr-1" />
                {fieldCount} Fields
              </Badge>
              <Badge variant="outline" className="text-sm">
                <FileJson className="h-3 w-3 mr-1" />
                Live Preview
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="builder" className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                <TabsTrigger value="builder" className="text-sm font-medium">
                  <Layers className="h-4 w-4 mr-2" />
                  Schema Builder
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-sm font-medium">
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="builder" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schema Fields */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="shadow-lg bg-gradient-to-br from-card to-muted/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-schema-primary" />
                        Schema Fields
                      </CardTitle>
                      <Button 
                        type="button"
                        onClick={() => addField()}
                        className="bg-gradient-to-r from-schema-primary to-purple-600 hover:from-schema-primary/90 hover:to-purple-600/90 shadow-md"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {schema.fields.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <div className="text-6xl mb-4">⚡</div>
                          <h3 className="text-xl font-semibold mb-2">Start Building Your Schema</h3>
                          <p className="mb-4">Click "Add Field" to create your first schema field</p>
                          <Button 
                            type="button"
                            onClick={() => addField()}
                            variant="outline"
                            className="border-dashed border-2 border-schema-primary text-schema-primary hover:bg-schema-primary/10"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Field
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {schema.fields.map((field) => (
                            <SchemaField
                              key={field.id}
                              field={field}
                              depth={0}
                              onUpdate={updateField}
                              onDelete={deleteField}
                              onAddChild={addField}
                              parentPath={[]}
                            />
                          ))}
                          <div className="pt-4 border-t border-dashed">
                            <Button 
                              type="button"
                              onClick={() => addField()}
                              variant="outline"
                              className="w-full border-dashed border-2 border-schema-primary/50 text-schema-primary hover:bg-schema-primary/10"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Another Field
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* JSON Preview Sidebar */}
                <div className="lg:col-span-1">
                  <JsonPreview data={jsonData} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <JsonPreview data={jsonData} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  );
};