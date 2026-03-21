'use client';

import { Violation } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedViolationsViewProps {
  violations: Array<
    Violation & {
      participant_name?: string;
      severity?: 'permitted' | 'warning' | 'critical';
      app_name?: string;
      is_approved?: boolean;
    }
  >;
}

const severityConfig = {
  critical: {
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
    label: 'Critical',
  },
  warning: {
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-200',
    icon: AlertCircle,
    label: 'Warning',
  },
  permitted: {
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-200',
    icon: CheckCircle2,
    label: 'Permitted',
  },
};

export function EnhancedViolationsView({ violations }: EnhancedViolationsViewProps) {
  // Group violations by severity
  const criticalViolations = violations.filter((v) => v.severity === 'critical');
  const warningViolations = violations.filter((v) => v.severity === 'warning');
  const permittedViolations = violations.filter((v) => v.severity === 'permitted');

  // Calculate statistics
  const totalCritical = criticalViolations.length;
  const totalWarnings = warningViolations.length;
  const totalPermitted = permittedViolations.length;

  const ViolationList = ({
    items,
    severity,
  }: {
    items: EnhancedViolationsViewProps['violations'];
    severity: 'critical' | 'warning' | 'permitted';
  }) => {
    const config = severityConfig[severity];
    const Icon = config.icon;

    if (items.length === 0) {
      return (
        <p className="text-center text-sm text-muted-foreground py-8">
          No {severity} violations recorded.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((violation) => (
          <div
            key={violation.id}
            className={`flex items-start gap-3 rounded-lg border ${config.borderColor} bg-background p-3`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">
                  {violation.participant_name || `Participant ${violation.participant_id}`}
                </span>
                <Badge variant="outline" className="text-xs">
                  {violation.violation_type}
                </Badge>
                {violation.app_name && (
                  <Badge variant="secondary" className="text-xs">
                    {violation.app_name}
                  </Badge>
                )}
                {violation.is_approved && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Approved
                  </Badge>
                )}
              </div>
              {violation.details && (
                <p className="text-sm text-muted-foreground mt-1">{violation.details}</p>
              )}
            </div>
            <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
              {new Date(violation.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalCritical}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalWarnings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Permitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPermitted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Violations by Severity */}
      <Card>
        <CardHeader>
          <CardTitle>Violations by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="critical" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="critical">
                Critical ({totalCritical})
              </TabsTrigger>
              <TabsTrigger value="warning">
                Warnings ({totalWarnings})
              </TabsTrigger>
              <TabsTrigger value="permitted">
                Permitted ({totalPermitted})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="critical" className="mt-4 space-y-3">
              <ViolationList items={criticalViolations} severity="critical" />
            </TabsContent>

            <TabsContent value="warning" className="mt-4 space-y-3">
              <ViolationList items={warningViolations} severity="warning" />
            </TabsContent>

            <TabsContent value="permitted" className="mt-4 space-y-3">
              <ViolationList items={permittedViolations} severity="permitted" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
