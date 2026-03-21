'use client';

import { Component } from '@/lib/db';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

interface ComponentDocumentationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: Component & {
    setup_instructions?: string;
    default_pins?: Record<string, string | number>;
    connection_diagram?: string;
    warnings?: string[];
    required_libraries?: string[];
    estimated_setup_time?: number;
    complexity_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  } | null;
}

const complexityColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export function ComponentDocumentationDialog({
  open,
  onOpenChange,
  component,
}: ComponentDocumentationDialogProps) {
  if (!component) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{component.name}</DialogTitle>
          <DialogDescription>{component.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap gap-3">
            {component.complexity_level && (
              <Badge
                className={complexityColors[component.complexity_level]}
              >
                {component.complexity_level}
              </Badge>
            )}
            {component.estimated_setup_time && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                ~{component.estimated_setup_time} min setup
              </Badge>
            )}
            <Badge variant="outline">{component.category}</Badge>
          </div>

          {/* Setup Instructions */}
          {component.setup_instructions && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Setup Instructions
              </h3>
              <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                {component.setup_instructions}
              </div>
            </div>
          )}

          {/* Default Pin Configuration */}
          {component.default_pins && Object.keys(component.default_pins).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Pin Configuration</h3>
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                {Object.entries(component.default_pins).map(([pin, value]) => (
                  <div key={pin} className="flex justify-between">
                    <span className="font-mono text-muted-foreground">{pin}:</span>
                    <span className="font-mono font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connection Diagram */}
          {component.connection_diagram && (
            <div className="space-y-2">
              <h3 className="font-semibold">Connection Diagram</h3>
              <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground font-mono">
                {component.connection_diagram}
              </div>
            </div>
          )}

          {/* Required Libraries */}
          {component.required_libraries && component.required_libraries.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Required Libraries</h3>
              <div className="flex flex-wrap gap-2">
                {component.required_libraries.map((lib) => (
                  <Badge key={lib} variant="secondary">
                    {lib}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {component.warnings && component.warnings.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                Important Warnings
              </h3>
              <ul className="space-y-2">
                {component.warnings.map((warning, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 text-sm bg-amber-50 p-2 rounded-lg border border-amber-200"
                  >
                    <span className="font-semibold text-amber-600 shrink-0">•</span>
                    <span className="text-amber-900">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Original Pinout */}
          {component.pinout && (
            <div className="space-y-2">
              <h3 className="font-semibold">Original Pinout Info</h3>
              <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                {component.pinout}
              </div>
            </div>
          )}

          {/* Code Snippet */}
          {component.code_snippet && (
            <div className="space-y-2">
              <h3 className="font-semibold">Code Snippet</h3>
              <div className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                <pre className="font-mono whitespace-pre-wrap break-words text-muted-foreground">
                  {component.code_snippet}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
