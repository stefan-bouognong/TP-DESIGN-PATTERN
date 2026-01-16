import { useState } from 'react';
import { Mail, Zap, Bell, Check, X, Loader2, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const eventTypes = [
  {
    id: 'VEHICLE_ADDED',
    name: 'New Vehicle Added',
    description: 'Triggered when a new vehicle is added to inventory',
    icon: Zap,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'PROMOTION',
    name: 'Promotion',
    description: 'Triggered when a new promotion is launched',
    icon: Bell,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    id: 'PRICE_DROP',
    name: 'Price Drop',
    description: 'Triggered when vehicle prices are reduced',
    icon: Bell,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

const mockSubscribers = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', events: ['NEW_VEHICLES', 'PROMOTIONS'] },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@email.com', events: ['NEW_VEHICLES', 'PRICE_DROPS'] },
  { id: 3, name: 'Entreprise XYZ', email: 'entreprise.xyz@email.com', events: ['CATALOG_UPDATES'] },
];

const ObserversPage = () => {
  const [smtpStatus, setSmtpStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [triggeringEvent, setTriggeringEvent] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('Test DriveDeal Notification');
  const { toast } = useToast();

  const testSmtpConnection = async () => {
    setTestingSmtp(true);
    // Simulate API call
    setTimeout(() => {
      setSmtpStatus('connected');
      toast({
        title: 'SMTP Connected',
        description: 'Successfully connected to mail server',
      });
      setTestingSmtp(false);
    }, 1500);
  };

  const sendTestEmail = async () => {
    if (!emailTo) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }
    setSendingEmail(true);
    setTimeout(() => {
      toast({
        title: 'Email Sent!',
        description: `Test email sent to ${emailTo}`,
      });
      setSendingEmail(false);
    }, 1500);
  };

  const triggerEvent = async (eventType: string) => {
    setTriggeringEvent(eventType);
    setTimeout(() => {
      toast({
        title: 'Event Triggered!',
        description: `${eventType} event has been triggered. Subscribers notified.`,
      });
      setTriggeringEvent(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Observer Pattern
          </span>
          <h1 className="section-heading">Event Notifications</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage event triggers, SMTP configuration, and customer subscriptions
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* SMTP Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Mail className="w-5 h-5" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>Test and manage email server connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SMTP Status */}
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Connection Status</span>
                  <div className="flex items-center gap-2">
                    {smtpStatus === 'unknown' && (
                      <span className="text-muted-foreground">Not tested</span>
                    )}
                    {smtpStatus === 'connected' && (
                      <span className="flex items-center gap-1 text-success">
                        <Check className="w-4 h-4" /> Connected
                      </span>
                    )}
                    {smtpStatus === 'failed' && (
                      <span className="flex items-center gap-1 text-destructive">
                        <X className="w-4 h-4" /> Failed
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Server:</span>
                    <span className="ml-2 font-mono">mail.nucle-x.work</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Port:</span>
                    <span className="ml-2 font-mono">465 (SSL)</span>
                  </div>
                </div>
                <Button
                  onClick={testSmtpConnection}
                  disabled={testingSmtp}
                  className="w-full mt-4"
                  variant="outline"
                >
                  {testingSmtp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>

              {/* Send Test Email */}
              <div className="space-y-4">
                <h4 className="font-medium">Send Test Email</h4>
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="admin@example.com"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="input-field"
                  />
                </div>
                <Button
                  onClick={sendTestEmail}
                  disabled={sendingEmail}
                  className="w-full btn-primary"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Event Triggers */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Trigger Events
              </CardTitle>
              <CardDescription>Manually trigger events to notify subscribers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventTypes.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${event.bgColor}`}>
                      <event.icon className={`w-5 h-5 ${event.color}`} />
                    </div>
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">{event.description}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerEvent(event.id)}
                    disabled={triggeringEvent === event.id}
                  >
                    {triggeringEvent === event.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Trigger'
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Subscribers */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Users className="w-5 h-5" />
                Subscriber Management
              </CardTitle>
              <CardDescription>View and manage event subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Subscriber</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-center py-3 px-4 font-medium">New Vehicles</th>
                      <th className="text-center py-3 px-4 font-medium">Promotions</th>
                      <th className="text-center py-3 px-4 font-medium">Price Drops</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-border">
                        <td className="py-3 px-4 font-medium">{subscriber.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{subscriber.email}</td>
                        <td className="py-3 px-4 text-center">
                          <Switch
                            defaultChecked={subscriber.events.includes('NEW_VEHICLES')}
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Switch
                            defaultChecked={subscriber.events.includes('PROMOTIONS')}
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Switch
                            defaultChecked={subscriber.events.includes('PRICE_DROPS')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ObserversPage;
