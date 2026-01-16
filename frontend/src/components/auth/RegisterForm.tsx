import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, User, Building } from 'lucide-react';
import { toast } from 'sonner';
import { ClientRequest, registerAndLoginClient } from '@/api/clients.service';
import { useAuth } from '@/contexts/AuthContext';
import { countries } from '@/data/countries';

export function RegisterForm({ onOpenChange, onSuccess }: { onOpenChange?: (open: boolean) => void; onSuccess?: () => void }) {
  const { register } = useAuth(); // On utilise register du contexte
  const navigate = useNavigate();

  const [customerType, setCustomerType] = useState<'individual' | 'company'>('individual');
  const [companyType, setCompanyType] = useState<'parent' | 'subsidiary'>('parent');

  // Common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Cameroun');

  // Individual
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Company
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [parentCompanyId, setParentCompanyId] = useState<string>('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      let data: ClientRequest;

      const common = {
        email,
        password,
        phone,
        address: `${address}, ${postalCode} ${city}, ${country}`,
        name: customerType === 'individual' ? `${firstName} ${lastName}` : companyName,
      };

      if (customerType === 'individual') {
        if (!firstName || !lastName) throw new Error('Prénom et nom obligatoires');

        data = {
          ...common,
          clientType: 'INDIVIDUAL',
          firstName,
          lastName,
          nationality: country,
        };
      } else {
        if (!companyName || !siret) throw new Error('Raison sociale et SIRET obligatoires');

        data = {
          ...common,
          clientType: 'COMPANY',
          companyId: siret.trim(),
          vatNumber: vatNumber.trim() || undefined,
          parentCompanyId: companyType === 'subsidiary' && parentCompanyId ? Number(parentCompanyId) : undefined,
        };
      }

      // ───── Appel API et login automatique ─────
      const { client, token } = await registerAndLoginClient(data);

      // ───── Mise à jour du contexte Auth ─────
      register({
        ...client,
        token,
      });

      toast.success('Compte créé avec succès ! Vous êtes maintenant connecté.');

      onSuccess?.();
      onOpenChange?.(false);
      // navigate('/dashboard'); // redirection après inscription
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || err.message || 'Erreur lors de la création du compte.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type de compte */}
      <div className="space-y-3">
        <Label>Type de compte</Label>
        <RadioGroup
          value={customerType}
          onValueChange={(v) => setCustomerType(v as 'individual' | 'company')}
          className="grid grid-cols-2 gap-4"
        >
          <Label
            htmlFor="individual"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              customerType === 'individual' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
            }`}
          >
            <RadioGroupItem value="individual" id="individual" />
            <User className="h-5 w-5" />
            <span className="font-medium">Particulier</span>
          </Label>
          <Label
            htmlFor="company"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              customerType === 'company' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
            }`}
          >
            <RadioGroupItem value="company" id="company" />
            <Building className="h-5 w-5" />
            <span className="font-medium">Société</span>
          </Label>
        </RadioGroup>
      </div>

      {/* Formulaire simplifié */}
      {customerType === 'individual' && (
        <div className="space-y-4">
          <Label>Prénom *</Label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <Label>Nom *</Label>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
      )}

      {customerType === 'company' && (
        <div className="space-y-4">
          <Label>Raison sociale *</Label>
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          <Label>SIRET *</Label>
          <Input value={siret} onChange={(e) => setSiret(e.target.value)} required />
          <Label>Numéro TVA (optionnel)</Label>
          <Input value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} />
        </div>
      )}

      <Label>Email *</Label>
      <Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} required />

      <Label>Téléphone *</Label>
      <Input value={phone} type="tel" onChange={(e) => setPhone(e.target.value)} required />

      <Label>Mot de passe *</Label>
      <Input value={password} type="password" onChange={(e) => setPassword(e.target.value)} required />

      <Label>Confirmation *</Label>
      <Input value={confirmPassword} type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />

      <Label>Adresse complète *</Label>
      <Input value={address} onChange={(e) => setAddress(e.target.value)} required />

      <Label>Ville *</Label>
      <Input value={city} onChange={(e) => setCity(e.target.value)} required />

      <Label>Code postal</Label>
      <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />

      <Label>Pays *</Label>
      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un pays" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          'Créer mon compte'
        )}
      </Button>
    </form>
  );
}
