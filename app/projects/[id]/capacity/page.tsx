"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useRouter, useParams } from "next/navigation";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Calculator, Zap, CheckCircle } from "lucide-react";

const Capacity = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string | undefined;

  const [formData, setFormData] = useState({
    sinr: "20", // dB
    modulation: "64QAM",
    userThroughput: "20" // Mbps
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCapacity = async () => {
    if (!projectId) return;
    setIsCalculating(true);
    setError(null);
    setResults(null);
    try {
      const { calculateCapacity } = await import("@/services/project");
      const params = {
        SNR: parseFloat(formData.sinr),
        modulation: formData.modulation,
        debitParUtilisateur: parseFloat(formData.userThroughput)
      };
      const data = await calculateCapacity(projectId, params);
      setResults(data.result || data);
    } catch (e: any) {
      setError(e.message || "Erreur lors du calcul de capacité");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-2">
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
              <h1 className="text-3xl font-bold text-slate-800">Calcul de Capacité</h1>
              <p className="text-slate-400">Formule de Shannon et efficacité spectrale</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de paramètres */}
            <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Paramètres de capacité
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configurez les paramètres pour le calcul de capacité réseau
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sinr" className="text-white">SNR (dB)</Label>
                    <Input
                      id="sinr"
                      type="number"
                      value={formData.sinr}
                      onChange={(e) => handleInputChange("sinr", e.target.value)}
                      placeholder="20"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userThroughput" className="text-white">Débit par utilisateur (Mbps)</Label>
                    <Input
                      id="userThroughput"
                      type="number"
                      value={formData.userThroughput}
                      onChange={(e) => handleInputChange("userThroughput", e.target.value)}
                      placeholder="20"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="modulation" className="text-white">Modulation</Label>
                  <Select value={formData.modulation} onValueChange={(v) => handleInputChange("modulation", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QPSK">QPSK (2 bps/Hz)</SelectItem>
                      <SelectItem value="16QAM">16-QAM (4 bps/Hz)</SelectItem>
                      <SelectItem value="64QAM">64-QAM (6 bps/Hz)</SelectItem>
                      <SelectItem value="256QAM">256-QAM (8 bps/Hz)</SelectItem>
                      <SelectItem value="1024QAM">1024-QAM (10 bps/Hz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={calculateCapacity}
                  disabled={isCalculating}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {isCalculating ? "Calcul en cours..." : "Calculer la capacité"}
                </Button>

                {isCalculating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Progression</span>
                      <span className="text-slate-400">Calcul Shannon</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résultats */}
            <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Résultats de capacité
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Capacité théorique et pratique du réseau
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
                        <p className="text-slate-400 text-sm">Capacité pratique</p>
                        <p className="text-2xl font-bold text-green-400">
                          {results.report.capacityPratique_Mbps ? `${Number(results.report.capacityPratique_Mbps).toFixed(1)} Mbps` : "N/A"}
                        </p>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-slate-400 text-sm">Utilisateurs max</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {results.report.utilisateursMax ?? "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                        <span className="text-slate-400">Capacité théorique</span>
                        <span className="text-white font-semibold">
                          {results.report.capacityTheorique_Mbps ? `${Number(results.report.capacityTheorique_Mbps).toFixed(1)} Mbps` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                        <span className="text-slate-400">Débit total requis</span>
                        <span className="text-white font-semibold">
                          {results.report.debitTotal_Mbps ? `${Number(results.report.debitTotal_Mbps).toFixed(1)} Mbps` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                        <span className="text-slate-400">Efficacité</span>
                        <span className="text-white font-semibold">
                          {results.report.efficacite ? `${Number(results.report.efficacite).toFixed(1)} %` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Zap className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      Cliquez sur "Calculer la capacité" pour obtenir les résultats
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

export default Capacity;
