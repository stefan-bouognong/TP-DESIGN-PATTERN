import { CartItem as CartItemType, VehicleOption } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Minus, Settings } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemCard({ item }: CartItemProps) {
  const { removeFromCart, updateOptions } = useCart();
  const [showOptions, setShowOptions] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);

  const toggleOption = (option: VehicleOption) => {
    const isSelected = item.selectedOptions.some((o) => o.id === option.id);
    
    if (isSelected) {
      updateOptions(
        item.vehicle.id,
        item.selectedOptions.filter((o) => o.id !== option.id)
      );
    } else {
      // Check for incompatibilities
      const incompatibleIds = option.incompatibleWith || [];
      const filteredOptions = item.selectedOptions.filter(
        (o) => !incompatibleIds.includes(o.id)
      );
      updateOptions(item.vehicle.id, [...filteredOptions, option]);
    }
  };

  const isOptionDisabled = (option: VehicleOption) => {
    const incompatibleIds = option.incompatibleWith || [];
    return item.selectedOptions.some((selected) =>
      incompatibleIds.includes(selected.id)
    );
  };

  const optionsTotal = item.selectedOptions.reduce((sum, o) => sum + o.price, 0);
  const itemTotal = (item.vehicle.price + optionsTotal) * item.quantity;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-card">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-muted">
          <img
            // src={item.vehicle.images[0]}
            alt={item.vehicle.name}
            className="h-full w-full object-cover"
          />
          {item.vehicle.isPromotion && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              -{item.vehicle.promotionPercentage}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{item.vehicle.brand}</p>
              <h3 className="font-display text-lg font-semibold">{item.vehicle.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {item.vehicle.year} • {item.vehicle.power} ch • {item.vehicle.color}
              </p>
            </div>

            <div className="text-right">
              {item.vehicle.originalPrice && (
                <span className="text-sm text-muted-foreground line-through block">
                  {formatPrice(item.vehicle.originalPrice)}
                </span>
              )}
              <span className="font-display text-xl font-bold text-accent">
                {formatPrice(item.vehicle.price)}
              </span>
            </div>
          </div>

          {/* Selected options */}
          {item.selectedOptions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.selectedOptions.map((option) => (
                <Badge key={option.id} variant="secondary" className="gap-1">
                  {option.name}
                  <span className="text-accent">+{formatPrice(option.price)}</span>
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOptions(!showOptions)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Options
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.vehicle.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right">
              {optionsTotal > 0 && (
                <p className="text-xs text-muted-foreground mb-1">
                  Options: +{formatPrice(optionsTotal)}
                </p>
              )}
              <p className="font-display font-bold text-lg">
                Total: {formatPrice(itemTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Options panel */}
      {showOptions && item.vehicle.options.length > 0 && (
        <div className="border-t border-border p-5 bg-muted/30 animate-slide-up">
          <h4 className="font-medium mb-4">Options disponibles</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {item.vehicle.options.map((option) => {
              const isSelected = item.selectedOptions.some((o) => o.id === option.id);
              const isDisabled = !isSelected && isOptionDisabled(option);

              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                    isSelected
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => !isDisabled && toggleOption(option)}
                    disabled={isDisabled}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{option.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{option.category}</p>
                  </div>
                  <span className="font-medium text-accent">+{formatPrice(option.price)}</span>
                </label>
              );
            })}
          </div>
          {item.vehicle.options.some((o) => o.incompatibleWith?.length) && (
            <p className="text-xs text-muted-foreground mt-3">
              * Certaines options sont incompatibles entre elles
            </p>
          )}
        </div>
      )}
    </div>
  );
}
