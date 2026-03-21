'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProctoringSettings() {
  const [newApp, setNewApp] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { data: whitelistData, mutate: refreshWhitelist } = useSWR(
    '/api/admin/whitelist',
    fetcher,
    { refreshInterval: 5000 }
  );

  const whitelistedApps = whitelistData?.whitelisted_apps || [];

  const handleAddApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', app_name: newApp }),
      });

      if (res.ok) {
        setNewApp('');
        refreshWhitelist();
      }
    } catch (error) {
      console.error('Failed to add app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveApp = async (appName: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', app_name: appName }),
      });

      if (res.ok) {
        refreshWhitelist();
      }
    } catch (error) {
      console.error('Failed to remove app:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proctoring Settings</CardTitle>
        <CardDescription>
          Manage whitelisted applications for participants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Alert */}
        <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">About Whitelisting</p>
            <p>
              Applications in this list will be marked as "permitted" when participants switch focus to them during the test. This allows participants to use development tools like Arduino IDE without triggering violations.
            </p>
          </div>
        </div>

        {/* Add New App */}
        <form onSubmit={handleAddApp} className="flex gap-2">
          <Input
            placeholder="Enter application name (e.g., Arduino IDE)"
            value={newApp}
            onChange={(e) => setNewApp(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" size="sm" disabled={loading || !newApp.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Add App
          </Button>
        </form>

        {/* Whitelisted Apps List */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Whitelisted Applications ({whitelistedApps.length})</p>
          {whitelistedApps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No whitelisted applications yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {whitelistedApps.map((app: string) => (
                <Badge
                  key={app}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5"
                >
                  {app}
                  <button
                    onClick={() => handleRemoveApp(app)}
                    disabled={loading}
                    className="ml-1 hover:text-destructive"
                    title={`Remove ${app}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Violation Categories Info */}
        <div className="pt-4 border-t space-y-3">
          <p className="text-sm font-medium">Violation Categories</p>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Badge className="bg-green-100 text-green-800 mt-0.5 shrink-0">PERMITTED</Badge>
              <div>
                <p className="font-medium">Local App Access</p>
                <p className="text-muted-foreground">Accessing whitelisted applications</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 mt-0.5 shrink-0">WARNING</Badge>
              <div>
                <p className="font-medium">Window Blur</p>
                <p className="text-muted-foreground">Lost focus without approved app context</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Badge className="bg-red-100 text-red-800 mt-0.5 shrink-0">CRITICAL</Badge>
              <div>
                <p className="font-medium">Tab Switch / Chat</p>
                <p className="text-muted-foreground">Switching to other browser tabs or chat interfaces</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
