'use client';

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Radio, CheckCircle, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { calculateDimensionnement } from "@/services/project"; // Votre service API


interface DimensioningResults {
  surface_km2: number;
  userDensity: number;
  totalUsers: number;
  gnodebParCouverture: number;
  gnodebParCapacite: number;
  gnodebRecommande: number;
  efficaciteCouverture: string;
  coutParGnodeb: number;
  devise: string;
  coutEstime: string;
}

const DimensioningPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [results, setResults] = useState<DimensioningResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [projectData, setProjectData] = useState({
    coutParGnodeb: 120000, // Coût par gNodeB
    devise: 'EUR' as 'FCFA' | 'EUR' | 'USD',
  });
  const [projectInfo, setProjectInfo] = useState({
    area: 0,
    userDensity: 0,
    totalUsers: 0
  });

  const {id}= use(params);
  const projectId = id;
  console.log(projectId);

  // Charger les informations du projet au démarrage
  useEffect(() => {
    const loadProjectInfo = async () => {
      try {
        // Vous pouvez ajouter un appel API pour récupérer les infos du projet
        // const project = await getProject(projectId);
        // setProjectInfo({ area: project.area, userDensity: project.userDensity, totalUsers: project.area * project.userDensity });
      } catch (error) {
        console.error("Erreur lors du chargement du projet:", error);
      }
    };

    if (projectId) {
      loadProjectInfo();
    }
  }, [projectId]);

  const handleCalculateDimensioning = async () => {
    setIsCalculating(true);
    
    try {
      const response = await calculateDimensionnement(projectId, {
        coutParGnodeb: projectData.coutParGnodeb,
        devise: projectData.devise
      });

      if (response.result && response.result.report) {
        setResults(response.result.report);
        toast.success("Dimensionnement calculé avec succès ✅");
      } else {
        throw new Error("Format de réponse inattendu");
      }
    } catch (error) {
      console.error("Erreur lors du calcul du dimensionnement:", error);
      //toast.error(er  .message || "Une erreur est survenue lors du calcul");
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    if (typeof value === 'string') return value;
    
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: projectData.devise,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(value);
  };

  const getLimitingFactor = () => {
    if (!results) return '';
    return results.gnodebParCouverture > results.gnodebParCapacite ? 'couverture' : 'capacité';
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dimensionnement gNodeB</h1>
            <p className="text-gray-600 mt-2">
              Calcul du nombre optimal de stations de base
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paramètres du projet */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Radio className="h-5 w-5 mr-2 text-blue-600" />
                Paramètres du dimensionnement
              </CardTitle>
              <CardDescription className="text-gray-500">
                Paramètres requis pour le calcul
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations du projet (lecture seule) */}
              {projectInfo.area > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Informations du projet</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-700">Surface</span>
                      <span className="text-gray-900 font-semibold">{projectInfo.area} km²</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-700">Densité utilisateurs</span>
                      <span className="text-gray-900 font-semibold">{projectInfo.userDensity}/km²</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-700">Utilisateurs totaux</span>
                    <span className="text-gray-900 font-semibold">{projectInfo.totalUsers.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Paramètres de coût */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Paramètres de coût</h4>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-700">Coût par gNodeB</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={projectData.coutParGnodeb}
                      onChange={(e) => setProjectData({...projectData, coutParGnodeb: Number(e.target.value)})}
                      className="w-32 p-2 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                    <select
                      value={projectData.devise}
                      onChange={(e) => setProjectData({...projectData, devise: e.target.value as 'FCFA' | 'EUR' | 'USD'})}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="FCFA">FCFA</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>Note:</strong> Le calcul utilise les résultats de couverture et de capacité 
                  déjà calculés pour ce projet.
                </p>
              </div>

              <Button
                onClick={handleCalculateDimensioning}
                disabled={isCalculating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm disabled:opacity-50"
              >
                <Calculator className="h-4 w-4 mr-2" />
                {isCalculating ? "Calcul en cours..." : "Calculer le dimensionnement"}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Résultats du dimensionnement
              </CardTitle>
              <CardDescription className="text-gray-500">
                Nombre optimal de gNodeB recommandé
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
                    <h3 className="text-blue-900 text-lg font-semibold mb-2">gNodeB Recommandés</h3>
                    <p className="text-4xl font-bold text-blue-900">{results.gnodebRecommande}</p>
                    <p className="text-blue-700 text-sm mt-2">stations de base nécessaires</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-orange-700 text-sm font-medium">Par couverture</p>
                      <p className="text-2xl font-bold text-orange-900">{results.gnodebParCouverture}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-purple-700 text-sm font-medium">Par capacité</p>
                      <p className="text-2xl font-bold text-purple-900">{results.gnodebParCapacite}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-700">Surface du projet</span>
                      <span className="text-gray-900 font-semibold">{results.surface_km2} km²</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-700">Utilisateurs totaux</span>
                      <span className="text-gray-900 font-semibold">{results.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-700">Efficacité couverture</span>
                      <span className="text-gray-900 font-semibold">{results.efficaciteCouverture}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="text-gray-700">Coût estimé</span>
                      <span className="text-gray-900 font-semibold">
                        {results.coutEstime}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="text-green-800 font-semibold mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recommandations
                    </h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Le dimensionnement est limité par la {getLimitingFactor()}</li>
                      <li>• Prévoir {Math.ceil(results.gnodebRecommande * 0.1)} gNodeB supplémentaires pour redondance</li>
                      <li>• Optimiser l'emplacement pour maximiser la couverture</li>
                      <li>• Coût unitaire: {formatCurrency(results.coutParGnodeb)}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <Radio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Cliquez sur "Calculer le dimensionnement" pour obtenir les résultats
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Les calculs de couverture et capacité doivent être effectués au préalable
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

export default DimensioningPage;