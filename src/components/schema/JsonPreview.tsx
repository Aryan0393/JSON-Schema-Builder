import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface JsonPreviewProps {
  data: Record<string, any>;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const jsonString = useMemo(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const isEmpty = Object.keys(data).length === 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const highlightedJson = useMemo(() => {
    if (isEmpty) return '';
    
    return jsonString
      .replace(/"([^"]+)":/g, '<span class="text-blue-600 font-semibold">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-green-600">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-orange-600">$1</span>')
      .replace(/[{}]/g, '<span class="text-purple-600 font-bold">$&</span>')
      .replace(/[\[\]]/g, '<span class="text-purple-600 font-bold">$&</span>');
  }, [jsonString, isEmpty]);

  return (
    <Card className="h-full bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">JSON Preview</CardTitle>
          <Badge variant="outline" className="text-xs">
            {Object.keys(data).length} field{Object.keys(data).length !== 1 ? 's' : ''}
          </Badge>
        </div>
        {!isEmpty && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-lg font-medium">No fields defined</p>
              <p className="text-sm">Add some fields to see the JSON preview</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <pre className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono border">
              <code 
                dangerouslySetInnerHTML={{ __html: highlightedJson }}
                className="block"
              />
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};