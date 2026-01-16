import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogIn, Mail, Lock, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authApi, setAuthToken, setUserRole } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

/**
 * Schéma de validation pour le formulaire de connexion
 */
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Page de connexion
 * 
 * Permet aux utilisateurs (clients et admins) de se connecter à l'application.
 * Le token JWT est stocké dans localStorage après une connexion réussie.
 */
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Gère la soumission du formulaire de connexion
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Appel à l'API de connexion
      const response = await authApi.login(data.email, data.password);

      // Stocker le token JWT et le rôle dans localStorage
      setAuthToken(response.token);
      setUserRole(response.role);

      // Mettre à jour le contexte d'authentification
      login(response.token, response.role);

      // Afficher un message de succès
      toast({
        title: 'Connexion réussie !',
        description: `Bienvenue, vous êtes connecté en tant que ${response.role}.`,
      });

      // Rediriger vers la page d'accueil après 1 seconde
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      // Extraire le message d'erreur du backend
      let errorMessage = 'Email ou mot de passe incorrect';
      
      if (error instanceof Error) {
        // Si c'est une erreur de l'API avec un message
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.message || errorData.error || error.message;
        } catch {
          // Si ce n'est pas du JSON, utiliser le message tel quel
          errorMessage = error.message;
        }
      }

      // Afficher un message d'erreur
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* En-tête avec logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">
              Drive<span className="text-primary">Deal</span>
            </h1>
            <p className="text-muted-foreground mt-2">Connectez-vous à votre compte</p>
          </div>
        </div>

        {/* Carte du formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Connexion
            </CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Champ Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@example.com"
                    className="pl-10 input-field"
                    {...register('email')}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 input-field"
                    {...register('password')}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            {/* Lien vers l'inscription */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Pas encore de compte ? </span>
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Compte admin de test : admin@drivedreal.com / admin123</p>
          <p className="text-xs">Si l'admin n'existe pas, créez-le avec POST /api/auth/register-admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
