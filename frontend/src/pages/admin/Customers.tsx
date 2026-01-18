import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Mail, Phone, Building, User, Car } from 'lucide-react';

interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'company';
  companyName?: string;
  subsidiaries?: number;
  fleetSize?: number;
  ordersCount: number;
  totalSpent: number;
}

const mockCustomers: MockCustomer[] = [
  { id: 'CLI-001', name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '+33 6 12 34 56 78', type: 'individual', ordersCount: 2, totalSpent: 45990 },
  { id: 'CLI-002', name: 'Marie Martin', email: 'marie.martin@email.com', phone: '+33 6 98 76 54 32', type: 'individual', ordersCount: 1, totalSpent: 52500 },
  { id: 'CLI-003', name: 'Pierre Durand', email: 'p.durand@transports-durand.fr', phone: '+33 1 23 45 67 89', type: 'company', companyName: 'SAS Transports Durand', subsidiaries: 3, fleetSize: 15, ordersCount: 5, totalSpent: 125000 },
  { id: 'CLI-004', name: 'Sophie Leroy', email: 'sophie@autoplus.fr', phone: '+33 4 56 78 90 12', type: 'company', companyName: 'Garage Auto Plus', subsidiaries: 1, fleetSize: 8, ordersCount: 12, totalSpent: 89000 },
  { id: 'CLI-005', name: 'Lucas Bernard', email: 'lucas.bernard@email.com', phone: '+33 7 89 01 23 45', type: 'individual', ordersCount: 1, totalSpent: 7490 },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState('');

  const filteredCustomers = mockCustomers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.companyName || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price);

  const individuals = mockCustomers.filter((c) => c.type === 'individual').length;
  const companies = mockCustomers.filter((c) => c.type === 'company').length;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Gestion des clients</h1>
            <p className="text-muted-foreground">
              {individuals} particuliers • {companies} sociétés
            </p>
          </div>
          <Button variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Commandes</TableHead>
                <TableHead>Total dépensé</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        {customer.type === 'company' ? (
                          <Building className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        {customer.companyName && (
                          <p className="text-sm text-muted-foreground">{customer.companyName}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.type === 'company' ? 'default' : 'secondary'}>
                      {customer.type === 'company' ? 'Société' : 'Particulier'}
                    </Badge>
                    {customer.type === 'company' && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{customer.subsidiaries} filiale{(customer.subsidiaries || 0) > 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {customer.fleetSize} véhicules
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.ordersCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-accent">{formatPrice(customer.totalSpent)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
