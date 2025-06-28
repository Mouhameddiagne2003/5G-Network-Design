'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { Layout } from "@/components/Layout";
import { ArrowLeft, Map as MapIcon, MapPin, Layers, Settings } from "lucide-react";
import { GoogleMap, Marker, Circle, LoadScript } from '@react-google-maps/api';

declare global {
  interface Window {
    google?: {
      maps: {
        Size: new (width: number, height: number) => { width: number; height: number; equals: (other: any) => boolean; toString: () => string; };
        // Ajoutez d'autres types au besoin
      };
    };
  }
}

interface MapComponentProps {
  id: string;
}

interface GNodeBData {
  lat: number;
  lng: number;
  range: number;
  id: number;
  name?: string;
}

interface CoverageData {
  gNodeBPositions: GNodeBData[];
  totalCoverage: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

const MapComponent: React.FC<MapComponentProps> = ({ id }) => {
  const router = useRouter();

  const [mapSettings, setMapSettings] = useState({
    zoom: 12,
    showCoverage: true,
    showGNodeB: true
  });

  const [coverageData, setCoverageData] = useState<CoverageData | null>(null);
  const [center, setCenter] = useState({ lat: 48.8566, lng: 2.3522 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données de couverture depuis la base de données
    const fetchCoverageData = async () => {
      try {
        // Remplacer par un appel API réel
        setTimeout(() => {
          const data: CoverageData = {
            gNodeBPositions: [
              { lat: 48.8566, lng: 2.3522, range: 2500, id: 1, name: "Site Paris Centre" },
              { lat: 48.8700, lng: 2.3400, range: 3200, id: 2, name: "Site Montmartre" },
              { lat: 48.8450, lng: 2.3700, range: 2800, id: 3, name: "Site Bastille" },
              { lat: 48.8620, lng: 2.3380, range: 3000, id: 4, name: "Site Louvre" },
            ],
            totalCoverage: 85.5
          };
          
          setCoverageData(data);
          
          // Calculer le centre de la carte basé sur les positions des gNodeB
          if (data.gNodeBPositions.length > 0) {
            const avgLat = data.gNodeBPositions.reduce((sum, pos) => sum + pos.lat, 0) / data.gNodeBPositions.length;
            const avgLng = data.gNodeBPositions.reduce((sum, pos) => sum + pos.lng, 0) / data.gNodeBPositions.length;
            setCenter({ lat: avgLat, lng: avgLng });
          }
        }, 1000);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error("Impossible de charger les données de couverture");
      }
    };

    fetchCoverageData();
  }, [id, toast]);

  const handleSettingChange = (field: string, value: string | boolean | number) => {
    setMapSettings(prev => ({ ...prev, [field]: value }));
  };

  const refreshMap = () => {
    toast.success("La visualisation a été actualisée avec les nouveaux paramètres");
  };

  const onMapLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/projects/${id}`)}
            className="border-blue-200 text-blue-100 hover:bg-blue-800/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Visualisation Cartographique</h1>
            <p className="text-blue-200 mt-2">
              Zones de couverture et positionnement des gNodeB
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paramètres de la carte */}
          <Card className="bg-white/95 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Paramètres de la carte
              </CardTitle>
              <CardDescription className="text-blue-700">
                Configurez l'affichage de la carte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="zoom" className="text-blue-900 font-medium">Niveau de zoom</Label>
                <Input
                  id="zoom"
                  type="number"
                  min="1"
                  max="20"
                  value={mapSettings.zoom}
                  onChange={(e) => handleSettingChange("zoom", parseInt(e.target.value))}
                  className="bg-white border-blue-300 text-blue-900 focus:border-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showCoverage"
                    checked={mapSettings.showCoverage}
                    onChange={(e) => handleSettingChange("showCoverage", e.target.checked)}
                    className="text-blue-600"
                  />
                  <Label htmlFor="showCoverage" className="text-blue-900">Afficher zones de couverture</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showGNodeB"
                    checked={mapSettings.showGNodeB}
                    onChange={(e) => handleSettingChange("showGNodeB", e.target.checked)}
                    className="text-blue-600"
                  />
                  <Label htmlFor="showGNodeB" className="text-blue-900">Afficher gNodeB</Label>
                </div>
              </div>

              <Button
                onClick={refreshMap}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Actualiser la carte
              </Button>
            </CardContent>
          </Card>

          {/* Carte principale */}
          <Card className="lg:col-span-2 bg-white/95 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <MapIcon className="h-5 w-5 mr-2" />
                Carte de couverture
              </CardTitle>
              <CardDescription className="text-blue-700">
                Visualisation interactive des zones couvertes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coverageData ? (
                <div className="space-y-4">
                  {/* Google Maps */}
                  <div className="rounded-lg overflow-hidden border-2 border-blue-200">
                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={mapSettings.zoom}
                        options={mapOptions}
                        onLoad={onMapLoad}
                      >
                        {/* Markers pour les gNodeB */}
                        {mapSettings.showGNodeB && coverageData.gNodeBPositions.map((gnodeb) => (
                          <div key={gnodeb.id}>
                            {typeof window !== 'undefined' && window.google && window.google.maps && (
                              <Marker
                                position={{ lat: gnodeb.lat, lng: gnodeb.lng }}
                                title={gnodeb.name || `gNodeB ${gnodeb.id}`}
                                icon={{
                                  url: 'data:image/svg+xml;base64,' + btoa(`
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="12" cy="12" r="8" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
                                      <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                                    </svg>
                                  `),
                                  scaledSize: new window.google.maps.Size(24, 24)
                                }}
                              />
                            )}
                          </div>
                        ))}

                        {/* Cercles de couverture */}
                        {mapSettings.showCoverage && coverageData.gNodeBPositions.map((gnodeb) => (
                          <Circle
                            key={`coverage-${gnodeb.id}`}
                            center={{ lat: gnodeb.lat, lng: gnodeb.lng }}
                            radius={gnodeb.range}
                            options={{
                              fillColor: '#3b82f6',
                              fillOpacity: 0.15,
                              strokeColor: '#3b82f6',
                              strokeOpacity: 0.8,
                              strokeWeight: 2,
                            }}
                          />
                        ))}
                      </GoogleMap>
                    </LoadScript>
                  </div>

                  {/* Statistiques */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-blue-700 text-sm">gNodeB actifs</p>
                      <p className="text-2xl font-bold text-blue-900">{coverageData.gNodeBPositions.length}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-green-700 text-sm">Couverture totale</p>
                      <p className="text-2xl font-bold text-green-900">{coverageData.totalCoverage}%</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <p className="text-orange-700 text-sm">Portée moyenne</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {coverageData.gNodeBPositions.length > 0 
                          ? (coverageData.gNodeBPositions.reduce((sum, pos) => sum + pos.range, 0) / coverageData.gNodeBPositions.length / 1000).toFixed(1)
                          : '0'
                        } km
                      </p>
                    </div>
                  </div>

                  {/* Liste des sites */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Sites gNodeB</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {coverageData.gNodeBPositions.map((gnodeb) => (
                        <div key={gnodeb.id} className="flex items-center space-x-2 text-xs">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">
                            {gnodeb.name || `Site ${gnodeb.id}`} - {(gnodeb.range / 1000).toFixed(1)}km
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Layers className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-spin" />
                  <p className="text-blue-700">
                    Chargement des données de couverture...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MapComponent;