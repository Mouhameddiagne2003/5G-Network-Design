"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useRouter, useParams } from "next/navigation";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Calculator, Signal, CheckCircle } from "lucide-react";
import {calculateCoverage} from "@/services/project";

const Coverage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;
  const [formData, setFormData] = useState({
    receiverSensitivity: "-100", // dBm
    gainAntenne: "18", // dBi
    pertesSysteme: "3" // dB
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const calculateCoveragee = async () => {
    setIsCalculating(true);
    setError(null);
    setResults(null);
    try {
      const params = {
        receiverSensitivity: parseFloat(formData.receiverSensitivity),
        gainAntenne: parseFloat(formData.gainAntenne),
        pertesSysteme: parseFloat(formData.pertesSysteme)
      };
      const data = await calculateCoverage(projectId as string, params);
      setResults(data.result || data);
    } catch (e: any) {
      setError(e.message || "Erreur lors du calcul de couverture");
    } finally {
      setIsCalculating(false);
    }
  };


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/projects/${projectId}`)}
              className="border-slate-600 text-white bg-slate-700 hover:bg-slate-800 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="font-semibold">Retour</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Calcul de Couverture</h1>
              <p className="text-slate-400">Modèle COST-231 Hata pour la prédiction de propagation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de paramètres */}
            <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Signal className="h-5 w-5 mr-2" />
                  Paramètres de propagation
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configurez les paramètres pour le calcul COST-231 Hata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receiverSensitivity" className="text-white">Sensibilité Rx (dBm)</Label>
                    <Input
                      id="receiverSensitivity"
                      type="number"
                      value={formData.receiverSensitivity}
                      onChange={(e) => handleInputChange("receiverSensitivity", e.target.value)}
                      placeholder="-100"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gainAntenne" className="text-white">Gain antenne (dBi)</Label>
                    <Input
                      id="gainAntenne"
                      type="number"
                      value={formData.gainAntenne}
                      onChange={(e) => handleInputChange("gainAntenne", e.target.value)}
                      placeholder="18"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pertesSysteme" className="text-white">Pertes système (dB)</Label>
                  <Input
                    id="pertesSysteme"
                    type="number"
                    value={formData.pertesSysteme}
                    onChange={(e) => handleInputChange("pertesSysteme", e.target.value)}
                    placeholder="3"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button
                  onClick={calculateCoveragee}
                  disabled={isCalculating}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  type="button"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {isCalculating ? "Calcul en cours..." : "Calculer la couverture"}
                </Button>

                {isCalculating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Progression</span>
                      <span className="text-slate-400">Calcul COST-231 Hata</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résultats */}
            <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Résultats de couverture
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Résultats du modèle de propagation COST-231 Hata
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-red-500 font-semibold mb-4">{error}</div>
                )}
                {results?.report ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-slate-400 text-sm">Portée maximale</p>
                        <p className="text-2xl font-bold text-green-400">
                          {results.report.d_km !== undefined ? `${Number(results.report.d_km).toFixed(2)} km` : "N/A"}
                        </p>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-slate-400 text-sm">Surface cellule</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {results.report.coverage_km2 !== undefined ? `${Number(results.report.coverage_km2).toFixed(2)} km²` : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                        <span className="text-slate-400">Perte de propagation</span>
                        <span className="text-white font-semibold">
                          {results.report.pertePropagation_dB !== undefined ? `${Number(results.report.pertePropagation_dB).toFixed(1)} dB` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                        <span className="text-slate-400">Budget de liaison</span>
                        <span className="text-white font-semibold">
                          {results.report.budgetLiaison_dB !== undefined ? `${Number(results.report.budgetLiaison_dB).toFixed(1)} dB` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                        <span className="text-slate-400">Marge de fading</span>
                        <span className="text-white font-semibold">
                          {results.report.margeFading_dB !== undefined ? `${Number(results.report.margeFading_dB).toFixed(1)} dB` : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-2">Recommandations</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Portée théorique calculée selon COST-231 Hata</li>
                        <li>• Prévoir une marge supplémentaire pour les obstacles</li>
                        <li>• Considérer les variations saisonnières</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Signal className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      Cliquez sur "Calculer la couverture" pour obtenir les résultats
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Coverage;