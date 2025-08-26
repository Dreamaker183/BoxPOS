'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Customize the look and feel of your POS and receipts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input id="brand-name" placeholder="Your Company Name" defaultValue="BoxPOS" />
          </div>

          <div className="space-y-2">
            <Label>Brand Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <Button variant="outline">Upload Logo</Button>
            </div>
            <p className="text-xs text-muted-foreground">Recommended size: 256x256px. PNG or JPG.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="relative">
                <Input id="primary-color" placeholder="#64B5F6" defaultValue="#64B5F6" className="pl-8" />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: '#64B5F6' }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="relative">
                <Input id="accent-color" placeholder="#FFB74D" defaultValue="#FFB74D" className="pl-8" />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: '#FFB74D' }} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Receipt Font</Label>
             <Input defaultValue="Inter" placeholder="e.g., Inter, Roboto" />
          </div>

        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button size="lg">Save Changes</Button>
      </div>
    </div>
  );
}
