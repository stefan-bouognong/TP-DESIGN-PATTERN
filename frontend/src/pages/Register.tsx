import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, Mail, Lock, User, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

/**
 * Schéma de validation pour le formulaire d'inscription
 */
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Page d'inscription
 * 
 * Permet aux nouveaux utilisateurs de créer un compte client.
 * Après l'inscription, l'utilisateur est redirigé vers la page de connexion.
 */
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  /**
   * Gère la soumission du formulaire d'inscription
   */
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Appel à l'API d'inscription
      const response = await authApi.registerClient({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Afficher un message de succès
      toast({
        title: 'Inscription réussie !',
        description: response || 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
      });

      // Rediriger vers la page de connexion après 1.5 secondes
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      // Afficher un message d'erreur
      toast({
        title: 'Erreur d\'inscription',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription',
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
            <p className="text-muted-foreground mt-2">Créez votre compte</p>
          </div>
        </div>

        {/* Carte du formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Inscription
            </CardTitle>
            <CardDescription>
              Remplissez le formulaire pour créer votre compte client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Champ Prénom */}
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Jean"
                    className="pl-10 input-field"
                    {...register('firstName')}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              {/* Champ Nom */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Dupont"
                    className="pl-10 input-field"
                    {...register('lastName')}
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>

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
                <p className="text-xs text-muted-foreground">
                  Au moins 6 caractères, une majuscule, une minuscule et un chiffre
                </p>
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                className="w-full btn-primary mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
            </form>

            {/* Lien vers la connexion */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte ? </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
