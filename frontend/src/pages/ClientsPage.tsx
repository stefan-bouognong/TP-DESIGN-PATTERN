import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Plus, Trash2, ChevronRight, Loader2, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Client } from '@/lib/api';

const individualSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(8, 'Phone is required'),
  address: z.string().min(5, 'Address is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(8, 'Phone is required'),
  address: z.string().min(5, 'Address is required'),
  companyId: z.string().min(5, 'Company ID is required'),
  vatNumber: z.string().min(5, 'VAT number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type IndividualFormData = z.infer<typeof individualSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

// Mock client hierarchy for demo
const mockClients: (Client & { subsidiaries?: Client[] })[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    address: '123 Main St, City',
    clientType: 'INDIVIDUAL',
    firstName: 'John',
    lastName: 'Smith',
    nationality: 'French',
  },
  {
    id: 2,
    name: 'AutoGroup Corp',
    email: 'contact@autogroup.com',
    phone: '+1987654321',
    address: '500 Corporate Blvd, Business City',
    clientType: 'COMPANY',
    companyId: '12345678901234',
    vatNumber: 'FR12345678901',
    fleetDiscount: 5.0,
    subsidiaries: [
      {
        id: 3,
        name: 'AutoGroup North',
        email: 'north@autogroup.com',
        phone: '+1555123456',
        address: '100 North St',
        clientType: 'COMPANY',
        companyId: '98765432109876',
        vatNumber: 'FR98765432109',
        parentCompanyId: 2,
        fleetDiscount: 7.5,
      },
    ],
  },
];

const ClientsPage = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState(mockClients);
  const [clientType, setClientType] = useState<'INDIVIDUAL' | 'COMPANY'>('INDIVIDUAL');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<number[]>([]);

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast({
        title: 'Accès refusé',
        description: 'Cette page est réservée aux administrateurs.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  // Afficher un message si l'utilisateur n'est pas admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen py-12 bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-5 h-5" />
              Accès refusé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cette page est réservée aux administrateurs. Seuls les administrateurs peuvent gérer les clients.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const individualForm = useForm<IndividualFormData>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      nationality: '',
      password: '',
    },
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      companyId: '',
      vatNumber: '',
      password: '',
    },
  });

  const toggleExpanded = (id: number) => {
    setExpandedCompanies((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const onSubmitIndividual = async (data: IndividualFormData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newClient: Client = {
        id: clients.length + 1,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        clientType: 'INDIVIDUAL',
        firstName: data.firstName,
        lastName: data.lastName,
        nationality: data.nationality,
      };
      setClients([...clients, newClient]);
      toast({
        title: 'Client Created',
        description: `${newClient.name} has been added successfully.`,
      });
      individualForm.reset();
      setIsLoading(false);
    }, 1000);
  };

  const onSubmitCompany = async (data: CompanyFormData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newClient = {
        id: clients.length + 1,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        clientType: 'COMPANY' as const,
        companyId: data.companyId,
        vatNumber: data.vatNumber,
        fleetDiscount: 5.0,
        subsidiaries: [],
      };
      setClients([...clients, newClient]);
      toast({
        title: 'Company Created',
        description: `${newClient.name} has been added successfully.`,
      });
      companyForm.reset();
      setIsLoading(false);
    }, 1000);
  };

  const renderClientTree = (client: Client & { subsidiaries?: Client[] }, depth = 0) => (
    <div
      key={client.id}
      className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}
    >
      <div className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors group">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          client.clientType === 'COMPANY' 
            ? 'bg-primary/10 text-primary' 
            : 'bg-accent/10 text-accent'
        }`}>
          {client.clientType === 'COMPANY' ? (
            <Building2 className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold truncate">{client.name}</h4>
            {client.clientType === 'COMPANY' && client.subsidiaries && client.subsidiaries.length > 0 && (
              <button
                onClick={() => toggleExpanded(client.id)}
                className="p-1 rounded hover:bg-muted"
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    expandedCompanies.includes(client.id) ? 'rotate-90' : ''
                  }`}
                />
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{client.email}</p>
        </div>
        {client.fleetDiscount && (
          <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            {client.fleetDiscount}% Fleet Discount
          </span>
        )}
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
      {client.clientType === 'COMPANY' &&
        expandedCompanies.includes(client.id) &&
        client.subsidiaries?.map((sub) => renderClientTree(sub, depth + 1))}
    </div>
  );

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Composite Pattern
          </span>
          <h1 className="section-heading">Client Management</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage individuals and companies with hierarchical structure and fleet discounts
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Client Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Create New Client</CardTitle>
              <CardDescription>Add an individual or company to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={clientType}
                onValueChange={(v) => setClientType(v as 'INDIVIDUAL' | 'COMPANY')}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="INDIVIDUAL" className="gap-2">
                    <User className="w-4 h-4" />
                    Individual
                  </TabsTrigger>
                  <TabsTrigger value="COMPANY" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    Company
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="INDIVIDUAL">
                  <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input {...individualForm.register('firstName')} className="input-field" />
                        {individualForm.formState.errors.firstName && (
                          <p className="text-sm text-destructive">{individualForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input {...individualForm.register('lastName')} className="input-field" />
                        {individualForm.formState.errors.lastName && (
                          <p className="text-sm text-destructive">{individualForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" {...individualForm.register('email')} className="input-field" />
                      {individualForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{individualForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input {...individualForm.register('phone')} className="input-field" />
                      </div>
                      <div className="space-y-2">
                        <Label>Nationality</Label>
                        <Input {...individualForm.register('nationality')} className="input-field" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input {...individualForm.register('address')} className="input-field" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" {...individualForm.register('password')} className="input-field" />
                    </div>
                    <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                      Create Individual
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="COMPANY">
                  <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input {...companyForm.register('name')} className="input-field" />
                      {companyForm.formState.errors.name && (
                        <p className="text-sm text-destructive">{companyForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" {...companyForm.register('email')} className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company ID</Label>
                        <Input {...companyForm.register('companyId')} className="input-field" />
                      </div>
                      <div className="space-y-2">
                        <Label>VAT Number</Label>
                        <Input {...companyForm.register('vatNumber')} className="input-field" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input {...companyForm.register('phone')} className="input-field" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input {...companyForm.register('address')} className="input-field" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" {...companyForm.register('password')} className="input-field" />
                    </div>
                    <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                      Create Company
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Client Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Users className="w-5 h-5" />
                Client Hierarchy
              </CardTitle>
              <CardDescription>View and manage client structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clients.map((client) => renderClientTree(client as Client & { subsidiaries?: Client[] }))}
              </div>
              {clients.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No clients yet. Create your first client above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
