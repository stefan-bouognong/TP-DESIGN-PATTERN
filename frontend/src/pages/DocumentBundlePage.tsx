import { useState } from 'react';
import { Download, FileText, Package, Loader2, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import type { DocumentBundle } from '@/lib/api';

const mockOrders = [
  { id: 1, clientName: 'John Smith', totalAmount: 93500, status: 'PENDING' },
  { id: 2, clientName: 'AutoGroup Corp', totalAmount: 75000, status: 'APPROVED' },
  { id: 3, clientName: 'Marie Martin', totalAmount: 45000, status: 'COMPLETED' },
];

const bundleTypes = [
  {
    id: 'COMPLETE',
    name: 'Complete Bundle',
    description: 'All documents: Order Form, Invoice, Registration, Transfer Certificate',
    documents: ['ORDER_FORM', 'INVOICE', 'REGISTRATION_REQUEST', 'TRANSFER_CERTIFICATE'],
  },
  {
    id: 'MINIMAL',
    name: 'Minimal Bundle',
    description: 'Essential document only: Order Form',
    documents: ['ORDER_FORM'],
  },
  {
    id: 'REGISTRATION',
    name: 'Registration Bundle',
    description: 'Documents for vehicle registration',
    documents: ['REGISTRATION_REQUEST', 'TRANSFER_CERTIFICATE'],
  },
];

const DocumentBundle = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [bundleType, setBundleType] = useState('COMPLETE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBundle, setGeneratedBundle] = useState<DocumentBundle | null>(null);
  const { toast } = useToast();

  const selectedOrder = mockOrders.find((o) => o.id === selectedOrderId);
  const selectedBundleType = bundleTypes.find((b) => b.id === bundleType);

  const generateBundle = async () => {
    if (!selectedOrderId) {
      toast({
        title: 'Error',
        description: 'Please select an order',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const bundle: DocumentBundle = {
        orderId: selectedOrderId,
        clientId: 1,
        bundleName: `${selectedBundleType?.name} for Order #${selectedOrderId}`,
        documentCount: selectedBundleType?.documents.length || 0,
        completed: bundleType === 'COMPLETE',
        downloadPath: `/downloads/bundle_order_${selectedOrderId}.zip`,
        documentTypes: selectedBundleType?.documents || [],
      };

      setGeneratedBundle(bundle);
      toast({
        title: 'Bundle Generated!',
        description: `${bundle.documentCount} documents created successfully.`,
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Builder Pattern
          </span>
          <h1 className="section-heading">Document Bundle</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate complete document bundles for orders with customizable options
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Configure Bundle</CardTitle>
              <CardDescription>Select order and bundle type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Selection */}
              <div className="space-y-2">
                <Label>Select Order</Label>
                <Select onValueChange={(v) => setSelectedOrderId(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOrders.map((order) => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        Order #{order.id} - {order.clientName} (${order.totalAmount.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bundle Type */}
              <div className="space-y-3">
                <Label>Bundle Type</Label>
                <RadioGroup value={bundleType} onValueChange={setBundleType} className="space-y-3">
                  {bundleTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        bundleType === type.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setBundleType(type.id)}
                    >
                      <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                      <div className="flex-1">
                        <label htmlFor={type.id} className="font-semibold cursor-pointer">
                          {type.name}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {type.documents.map((doc) => (
                            <span
                              key={doc}
                              className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                onClick={generateBundle}
                disabled={!selectedOrderId || isGenerating}
                className="w-full btn-primary"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Bundle...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Generate Bundle
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview & Download */}
          <div className="space-y-6">
            {/* Order Info */}
            {selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Order ID</div>
                      <div className="font-semibold">#{selectedOrder.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Client</div>
                      <div className="font-semibold">{selectedOrder.clientName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="font-semibold">${selectedOrder.totalAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="font-semibold">{selectedOrder.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Bundle */}
            {generatedBundle && (
              <Card className="border-success bg-success/5 animate-scale-in">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                    Bundle Generated!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-white dark:bg-black/20">
                    <div className="font-semibold mb-2">{generatedBundle.bundleName}</div>
                    <div className="text-sm text-muted-foreground">
                      {generatedBundle.documentCount} documents generated
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Included Documents:</div>
                    {generatedBundle.documentTypes.map((doc) => (
                      <div
                        key={doc}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button className="flex-1 btn-accent">
                      <Download className="w-4 h-4 mr-2" />
                      Download ZIP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentBundle;
