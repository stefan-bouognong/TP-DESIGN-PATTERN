import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';

interface VehicleFormProps {
  onSubmit: (vehicle: any) => void;
  onCancel: () => void;
  initialData?: Partial<Vehicle>;
}

export function VehicleForm({ onSubmit, onCancel, initialData }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    vehicleType: initialData?.vehicleType || 'CAR',
    factoryType: initialData?.factoryType || 'ELECTRIC',
    price: initialData?.price?.toString() || '',
    color: initialData?.color || '',
    year: initialData?.year?.toString() || new Date().getFullYear().toString(),
    description: initialData?.description || '',
    available: initialData?.available ?? true,
    onSale: initialData?.onSale ?? false,

    // Voiture
    doors: initialData?.doors?.toString() || '5',
    hasSunroof: initialData?.hasSunroof ?? false,

    // Scooter
    hasTopCase: initialData?.hasTopCase ?? false,
    maxSpeed: initialData?.maxSpeed?.toString() || '45',

    // Communs électrique/thermique
    batteryCapacity: initialData?.batteryCapacity?.toString() || '',
    range: initialData?.range?.toString() || '',
    fuelTankCapacity: initialData?.fuelTankCapacity?.toString() || '',
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Requis';
    if (!formData.model.trim()) newErrors.model = 'Requis';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Prix invalide';
    if (!formData.color.trim()) newErrors.color = 'Requis';
    if (!formData.year || Number(formData.year) < 1900) newErrors.year = 'Année invalide';

    if (formData.vehicleType === 'CAR') {
      if (!formData.doors || Number(formData.doors) < 2) newErrors.doors = '2 à 5 portes attendues';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadToCloudinary = async (
    file: File,
    resourceType: 'image' | 'video'
  ): Promise<string> => {
    const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      throw new Error('Configuration Cloudinary manquante');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append("cloud_name","dqmsvnt0e")
    const res = await fetch(`${CLOUDINARY_URL}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      throw new Error('Erreur upload Cloudinary');
    }

    const data = await res.json();
    return data.secure_url;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const baseData = {
      name: formData.name.trim(),
      brand: formData.brand.trim() || undefined,
      model: formData.model.trim(),
      vehicleType: formData.vehicleType as 'CAR' | 'SCOOTER',
      factoryType: formData.factoryType as 'ELECTRIC' | 'GASOLINE',
      price: Number(formData.price),
      color: formData.color.trim(),
      year: Number(formData.year),
      description: formData.description.trim(),
      available: formData.available,
      onSale: formData.onSale,
    };

    let specificData: any = {};

    if (formData.vehicleType === 'CAR') {
      specificData = {
        doors: Number(formData.doors),
        hasSunroof: formData.hasSunroof,
      };
    } else if (formData.vehicleType === 'SCOOTER') {
      specificData = {
        hasTopCase: formData.hasTopCase,
        maxSpeed: Number(formData.maxSpeed),
      };
    }

    // Ajout conditionnel des champs batterie/autonomie/réservoir
    if (formData.factoryType === 'ELECTRIC' && formData.batteryCapacity) {
      specificData = { ...specificData, batteryCapacity: Number(formData.batteryCapacity) };
    }
    if (formData.range) {
      specificData = { ...specificData, range: Number(formData.range) };
    }
    if (formData.factoryType === 'GASOLINE' && formData.fuelTankCapacity) {
      specificData = { ...specificData, fuelTankCapacity: Number(formData.fuelTankCapacity) };
    }

    try {
      let imageUrl: string | undefined;
      let videoUrl: string | undefined;

      // if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, 'image');
        console.log('TESTEDSDSDJKJKJKJ',imageUrl)
      // }

      if (videoFile) {
        videoUrl = await uploadToCloudinary(videoFile, 'video');
      }

      const vehicleToSend = {
        ...baseData,
        ...specificData,
       imageUrl,
       videoUrl
      };
      
      console.log("VEHICLE TO SEND", vehicleToSend);

      onSubmit(vehicleToSend);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’upload média');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const isCar = formData.vehicleType === 'CAR';
  const isElectric = formData.factoryType === 'ELECTRIC';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* NOM */}
        <div className="col-span-2">
          <Label>Nom *</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Model Y Performance"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        {/* MARQUE – MODÈLE */}
        <div>
          <Label>Marque</Label>
          <Input
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="Tesla, Yamaha, etc."
          />
        </div>
        <div>
          <Label>Modèle *</Label>
          <Input
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="Model 3 / TMAX / ..."
            className={errors.model ? 'border-destructive' : ''}
          />
          {errors.model && <p className="text-sm text-destructive mt-1">{errors.model}</p>}
        </div>

        {/* TYPE VÉHICULE */}
        <div>
          <Label>Type *</Label>
          <Select
            value={formData.vehicleType}
            onValueChange={(v) => handleChange('vehicleType', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAR">Voiture</SelectItem>
              <SelectItem value="SCOOTER">Scooter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ÉNERGIE */}
        <div>
          <Label>Énergie *</Label>
          <Select
            value={formData.factoryType}
            onValueChange={(v) => handleChange('factoryType', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ELECTRIC">Électrique</SelectItem>
              <SelectItem value="GASOLINE">Essence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PRIX – COULEUR – ANNÉE */}
        <div>
          <Label>Prix (FCFA) *</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            min="1000"
            className={errors.price ? 'border-destructive' : ''}
          />
          {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label>Couleur *</Label>
          <Input
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            placeholder="Noir métallisé"
            className={errors.color ? 'border-destructive' : ''}
          />
          {errors.color && <p className="text-sm text-destructive mt-1">{errors.color}</p>}
        </div>

        <div>
          <Label>Année *</Label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            min="2000"
            max={new Date().getFullYear() + 1}
            className={errors.year ? 'border-destructive' : ''}
          />
          {errors.year && <p className="text-sm text-destructive mt-1">{errors.year}</p>}
        </div>

        {/* CHAMPS CONDITIONNELS VOITURE */}
        {isCar && (
          <>
            <div>
              <Label>Nombre de portes</Label>
              <Input
                type="number"
                value={formData.doors}
                onChange={(e) => handleChange('doors', e.target.value)}
                min="2"
                max="5"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="sunroof"
                checked={formData.hasSunroof}
                onCheckedChange={(checked) => handleChange('hasSunroof', !!checked)}
              />
              <Label htmlFor="sunroof">Toit ouvrant / panoramique</Label>
            </div>
          </>
        )}

        {/* CHAMPS CONDITIONNELS SCOOTER */}
        {!isCar && (
          <>
            <div>
              <Label>Vitesse max (km/h)</Label>
              <Input
                type="number"
                value={formData.maxSpeed}
                onChange={(e) => handleChange('maxSpeed', e.target.value)}
                min="25"
                max="180"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="topcase"
                checked={formData.hasTopCase}
                onCheckedChange={(checked) => handleChange('hasTopCase', !!checked)}
              />
              <Label htmlFor="topcase">Coffre top-case</Label>
            </div>
          </>
        )}

        {/* AUTONOMIE / BATTERIE / RÉSERVOIR */}
        {isElectric && (
          <div>
            <Label>Capacité batterie (kWh)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.batteryCapacity}
              onChange={(e) => handleChange('batteryCapacity', e.target.value)}
              placeholder="60, 75, 82..."
            />
          </div>
        )}

        <div>
          <Label>Autonomie estimée (km)</Label>
          <Input
            type="number"
            value={formData.range}
            onChange={(e) => handleChange('range', e.target.value)}
            placeholder="350 – 550 km"
          />
        </div>

        {!isElectric && (
          <div>
            <Label>Réservoir (litres)</Label>
            <Input
              type="number"
              value={formData.fuelTankCapacity}
              onChange={(e) => handleChange('fuelTankCapacity', e.target.value)}
              min="20"
              max="100"
            />
          </div>
        )}

        {/* IMAGE */}
        <div className="col-span-2">
          <Label>Image du véhicule</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 max-h-48 rounded-md border"
            />
          )}
        </div>

        {/* VIDÉO */}
        <div className="col-span-2">
          <Label>Vidéo (optionnelle)</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setVideoFile(file);
                setVideoPreview(URL.createObjectURL(file));
              }
            }}
          />
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="mt-2 max-h-56 rounded-md border"
            />
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="col-span-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="État, options, historique..."
            rows={4}
          />
        </div>

        {/* Disponible / En vente */}
        <div className="flex items-center space-x-8 col-span-2 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={formData.available}
              onCheckedChange={(c) => handleChange('available', !!c)}
            />
            <Label htmlFor="available">Disponible à la vente</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={formData.onSale}
              onCheckedChange={(c) => handleChange('onSale', !!c)}
            />
            <Label htmlFor="onSale">En promotion / vitrine</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Modifier' : 'Créer le véhicule'}
        </Button>
      </div>
    </form>
  );
}