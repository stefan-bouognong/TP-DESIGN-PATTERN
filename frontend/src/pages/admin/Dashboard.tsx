import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockVehicles } from '@/data/mockVehicles';
import { 
  Car, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Package,
  AlertTriangle,
  FileText,
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const totalVehicles = mockVehicles.length;
  const availableVehicles = mockVehicles.filter((v) => v.status === 'available').length;
  const promotions = mockVehicles.filter((v) => v.isPromotion).length;
  const longInStock = mockVehicles.filter((v) => v.daysInStock > 60).length;

  const totalValue = mockVehicles.reduce((acc, v) => acc + v.price * v.quantity, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);

  const stats = [
    {
      title: 'Véhicules en stock',
      value: totalVehicles,
      description: `${availableVehicles} disponibles`,
      icon: Car,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Commandes ce mois',
      value: 24,
      description: '18 livrées',
      icon: ShoppingCart,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Clients actifs',
      value: 156,
      description: '12 nouveaux',
      icon: Users,
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Valeur du stock',
      value: formatPrice(totalValue),
      description: 'Estimation totale',
      icon: TrendingUp,
      isPrice: true,
    },
  ];

  const recentOrders = [
    { id: 'CMD-001', customer: 'Jean Dupont', vehicle: 'Tesla Model 3', status: 'pending', date: '15/01/2024' },
    { id: 'CMD-002', customer: 'Marie Martin', vehicle: 'BMW Série 3', status: 'confirmed', date: '14/01/2024' },
    { id: 'CMD-003', customer: 'Pierre Durand', vehicle: 'Vespa Elettrica', status: 'delivered', date: '13/01/2024' },
  ];

  const statusColors = {
    pending: 'bg-warning text-warning-foreground',
    confirmed: 'bg-accent text-accent-foreground',
    delivered: 'bg-success text-success-foreground',
  };

  const statusLabels = {
    pending: 'En cours',
    confirmed: 'Confirmée',
    delivered: 'Livrée',
  };

  return (
    <AdminLayout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">Bienvenue dans l'espace administrateur</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/vehicles">
                <Car className="h-4 w-4 mr-2" />
                Gérer les véhicules
              </Link>
            </Button>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  {stat.trend && (
                    <Badge variant="secondary" className={stat.trendUp ? 'text-success' : 'text-destructive'}>
                      {stat.trend}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Alertes stock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {longInStock > 0 && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium">{longInStock} véhicule{longInStock > 1 ? 's' : ''} depuis +60 jours</p>
                      <p className="text-sm text-muted-foreground">Considérez une promotion</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{promotions} promotion{promotions > 1 ? 's' : ''} active{promotions > 1 ? 's' : ''}</p>
                    <p className="text-sm text-muted-foreground">Véhicules en solde</p>
                  </div>
                </div>
                <Badge>{promotions}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Dernières commandes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/orders">
                  Voir tout
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.id}</span>
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer} • {order.vehicle}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Car className="h-5 w-5" />
                <span>Nouveau véhicule</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span>Nouveau client</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Package className="h-5 w-5" />
                <span>Nouvelle promo</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span>Générer document</span>
              </Button>
            </CardContent>
          </Card>

          {/* Vehicle Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition du stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Automobiles', count: mockVehicles.filter((v) => v.type === 'automobile').length, color: 'bg-accent' },
                  { label: 'Scooters', count: mockVehicles.filter((v) => v.type === 'scooter').length, color: 'bg-success' },
                  { label: 'Électriques', count: mockVehicles.filter((v) => v.fuelType === 'electric').length, color: 'bg-primary' },
                  { label: 'Essence', count: mockVehicles.filter((v) => v.fuelType === 'essence').length, color: 'bg-warning' },
                ].map((category) => (
                  <div key={category.label} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category.label}</span>
                        <span className="text-sm text-muted-foreground">{category.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full ${category.color} rounded-full transition-all duration-500`}
                          style={{ width: `${(category.count / totalVehicles) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
