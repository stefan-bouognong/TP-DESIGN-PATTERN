import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FileText, Download, Home, Car } from 'lucide-react';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();

  const documents = [
    { name: 'Bon de commande', type: 'PDF' },
    { name: 'Demande d\'immatriculation', type: 'PDF' },
    { name: 'Certificat de cession', type: 'PDF' },
  ];

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Commande confirmée !</h1>
            <p className="text-muted-foreground">
              Votre commande <span className="font-medium text-foreground">{orderId}</span> a été enregistrée avec succès.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                Vos documents
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Les documents suivants ont été générés automatiquement et sont disponibles au téléchargement.
              </p>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {doc.type}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h3 className="font-medium mb-2">Prochaines étapes</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  Vous recevrez un email de confirmation avec le détail de votre commande.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  Notre équipe vous contactera sous 24h pour organiser la livraison.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  Préparez les documents nécessaires à l'immatriculation.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/catalog">
                  <Car className="h-4 w-4 mr-2" />
                  Continuer mes achats
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
