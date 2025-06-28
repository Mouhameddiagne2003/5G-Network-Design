"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { createProject } from "@/services/project";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import AddressAutocomplete from "@/components/AddressAutocomplete";

const ProjectForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    area: "",
    userDensity: "",
    frequency: "3.5",
    bandwidth: "100",
    zoneType: "URBAIN",
    services: ["EMBB"],
    power: "43",
    antennaHeight: "30",
    userHeight: "1.5",
    address: "",
    latitude: 0,
    longitude: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [expertMode, setExpertMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useGoogleMapsLoader();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude: lat,
      longitude: lng
    }));
    setError(null); // Clear any previous location errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("hello");
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation pour l'adresse et les coordonnées
    if (!formData.address || !formData.latitude || !formData.longitude) {
      setError("Veuillez sélectionner une adresse valide avec les coordonnées");
      setIsLoading(false);
      return;
    }

    try {
      // Préparer les données pour le backend (adapter les types si besoin)
      const data = {
        name: formData.name,
        description: formData.description,
        area: parseFloat(formData.area),
        userDensity: parseInt(formData.userDensity, 10),
        frequency: parseFloat(formData.frequency),
        bandwidth: parseInt(formData.bandwidth, 10),
        zoneType: formData.zoneType,
        services: formData.services,
        power: parseFloat(formData.power),
        antennaHeight: parseFloat(formData.antennaHeight),
        userHeight: parseFloat(formData.userHeight),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
      
      await createProject(data);
      if (typeof window !== 'undefined') {
        window.alert("Le nouveau projet a été créé avec succès");
      }
      router.push("/projects");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du projet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
        {/* Header */}
        {error && (
          <div className="mb-4 text-red-500 font-semibold text-center bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/projects")}
            className="border-slate-600 text-white bg-slate-700 hover:bg-slate-800 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="font-semibold">Retour</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Nouveau projet</h1>
            <p className="text-slate-400">Configurez les paramètres de votre réseau 5G</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations générales */}
            <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Informations générales</CardTitle>
                <CardDescription className="text-slate-400">
                  Définissez les paramètres de base de votre projet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-white">Nom du projet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Réseau 5G Dakar Centre"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    required
                  />
                </div>

                {/* Champ d'adresse avec Google Maps */}
                <div>
                  <Label htmlFor="address" className="text-white flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Adresse / Localisation
                  </Label>
                  <div className="mt-2">
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                        onPlaceChanged={() => {
                          const place = autocompleteRef.current?.getPlace();
                          if (place?.geometry?.location) {
                            const location = place.geometry.location;
                            const address = place.formatted_address || '';
                            setFormData(prev => ({
                              ...prev,
                              address: address,
                              latitude: typeof location.lat === 'function' ? location.lat() : 0,
                              longitude: typeof location.lng === 'function' ? location.lng() : 0
                            }));
                          }
                        }}
                        options={{ componentRestrictions: { country: 'sn' } }}
                      >
                        <Input
                          className="w-full bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                          placeholder="Rechercher une adresse au Sénégal..."
                          value={formData.address}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              address: e.target.value,
                              latitude: 0,
                              longitude: 0
                            }))
                          }
                          required
                        />
                      </Autocomplete>
                    ) : (
                      <Input
                        className="w-full bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                        placeholder="Chargement de Google Maps..."
                        disabled
                      />
                    )}
                  </div>
                  {formData.latitude && formData.longitude && (
                    <div className="mt-2 p-2 bg-slate-800 rounded-md">
                      <p className="text-xs text-green-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Coordonnées: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Description du projet"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area" className="text-white">Surface (km²)</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      placeholder="25.5"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="userDensity" className="text-white">Densité (users/km²)</Label>
                    <Input
                      id="userDensity"
                      type="number"
                      value={formData.userDensity}
                      onChange={(e) => handleInputChange("userDensity", e.target.value)}
                      placeholder="1200"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Type de zone</Label>
                  <RadioGroup
                    value={formData.zoneType}
                    onValueChange={(value) => handleInputChange("zoneType", value)}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="URBAIN" id="urban" />
                      <Label htmlFor="urban" className="text-slate-300">Urbain</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PERI_URBAIN" id="suburban" />
                      <Label htmlFor="suburban" className="text-slate-300">Périurbain</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="RURAL" id="rural" />
                      <Label htmlFor="rural" className="text-slate-300">Rural</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Paramètres techniques */}
            <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Paramètres techniques</CardTitle>
                <CardDescription className="text-slate-400">
                  Configurez les paramètres radio de votre réseau
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency" className="text-white">Fréquence (GHz)</Label>
                    <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3.5">3.5 GHz</SelectItem>
                        <SelectItem value="26">26 GHz (mmWave)</SelectItem>
                        <SelectItem value="28">28 GHz (mmWave)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bandwidth" className="text-white">Bande passante (MHz)</Label>
                    <Input
                      id="bandwidth"
                      type="number"
                      value={formData.bandwidth}
                      onChange={(e) => handleInputChange("bandwidth", e.target.value)}
                      placeholder="100"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                {/* Mode expert */}
                <div className="flex items-center space-x-2 mt-2 mb-2">
                  <input
                    type="checkbox"
                    id="expertMode"
                    checked={expertMode}
                    onChange={() => setExpertMode(val => !val)}
                    className="accent-orange-500"
                  />
                  <Label htmlFor="expertMode" className="text-slate-300 cursor-pointer">Mode expert : modifier hauteur gNodeB, utilisateur, puissance</Label>
                </div>
                {expertMode && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="antennaHeight" className="text-white">Hauteur antenne (m)</Label>
                        <Input
                          id="antennaHeight"
                          type="number"
                          value={formData.antennaHeight}
                          onChange={(e) => handleInputChange("antennaHeight", e.target.value)}
                          placeholder="30"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                          required={expertMode}
                        />
                      </div>
                      <div>
                        <Label htmlFor="userHeight" className="text-white">Hauteur utilisateur (m)</Label>
                        <Input
                          id="userHeight"
                          type="number"
                          step="0.1"
                          value={formData.userHeight}
                          onChange={(e) => handleInputChange("userHeight", e.target.value)}
                          placeholder="1.5"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                          required={expertMode}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="transmitPower" className="text-white">Puissance émission (dBm)</Label>
                      <Input
                        id="transmitPower"
                        type="number"
                        value={formData.power}
                        onChange={(e) => handleInputChange("power", e.target.value)}
                        placeholder="46"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                        required={expertMode}
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label className="text-white">Services supportés</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["EMBB", "URLLC", "MMTC"].map((service) => (
                      <Button
                        key={service}
                        type="button"
                        variant={formData.services.includes(service) ? "default" : "outline"}
                        size="sm"
                        className={formData.services.includes(service)
                          ? "bg-orange-500 hover:bg-orange-600 text-white font-bold"
                          : "border-slate-600 text-white hover:bg-slate-700"
                        }
                        onClick={() => handleServiceToggle(service)}
                      >
                        {service}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/projects")}
              className="border-slate-600 text-white bg-slate-700 hover:bg-slate-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.latitude || !formData.longitude}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Sauvegarde..." : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Layout>

  );
};

export default ProjectForm;