"use client";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";

const libraries: Libraries = ["places"];

interface AddressAutocompleteProps {
  onSelect: (address: string, lat: number, lng: number) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function AddressAutocomplete({ 
  onSelect, 
  defaultValue = "",
  placeholder = "Rechercher une adresse au Sénégal...",
  className = "",
  required = false
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [hasSelected, setHasSelected] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (loadError) {
      setError("Erreur de chargement de Google Maps");
      setIsLoading(false);
      return;
    }

    if (!isLoaded) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (!inputRef.current) return;

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "sn" },
        fields: ["formatted_address", "geometry", "name"],
        types: ["geocode", "establishment"],
      });

      const handlePlaceChange = () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry?.location) {
          setError("Impossible de localiser cette adresse");
          setHasSelected(false);
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const fullAddress = place.formatted_address || place.name || inputRef.current?.value || "";

        // Vérifier que les coordonnées sont bien au Sénégal (approximativement)
        if (lat < 12.0 || lat > 16.7 || lng < -17.6 || lng > -11.3) {
          setError("Veuillez sélectionner une adresse au Sénégal");
          setHasSelected(false);
          return;
        }

        setError("");
        setHasSelected(true);
        onSelect(fullAddress, lat, lng);
      };

      autocomplete.addListener("place_changed", handlePlaceChange);

      // Cleanup function
      return () => {
        if (window.google && window.google.maps && window.google.maps.event) {
          window.google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    } catch (err) {
      console.error("Erreur lors de l'initialisation de l'autocomplete:", err);
      setError("Erreur d'initialisation de la recherche d'adresse");
    }
  }, [isLoaded, loadError, onSelect]);

  const handleInputChange = () => {
    if (hasSelected) {
      setHasSelected(false);
      setError("");
    }
  };

  const baseClassName = `w-full p-3 border rounded-lg transition-all duration-200 ${className}`;
  
  let inputClassName = baseClassName;
  if (error) {
    inputClassName += " border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200";
  } else if (hasSelected) {
    inputClassName += " border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200";
  } else {
    inputClassName += " border-slate-300 focus:border-orange-500 focus:ring-orange-200";
  }

  if (isLoading) {
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Chargement de Google Maps..."
          className={`${baseClassName} border-slate-300 bg-slate-50`}
          disabled
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Erreur de chargement de Google Maps"
          className={`${baseClassName} border-red-300 bg-red-50`}
          disabled
        />
        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClassName}
        required={required}
        onChange={handleInputChange}
      />
      
      {/* Icon indicator */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {hasSelected ? (
          <MapPin className="h-4 w-4 text-green-600" />
        ) : error ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : (
          <MapPin className="h-4 w-4 text-slate-400" />
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}

      {/* Success message */}
      {hasSelected && !error && (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          Adresse sélectionnée avec succès
        </p>
      )}
    </div>
  );
}