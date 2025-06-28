"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Edit,
  Signal,
  Zap,
  Radio,
  Network,
  Map,
  FileText,
  BarChart3,
  MapPin,
  Users,
  Antenna
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/navigation";

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TOUS les hooks doivent être déclarés AVANT tout return !
  // Hooks déclarés UNE SEULE FOIS, tout en haut
  const [coverage, setCoverage] = useState<any | null>(null);
  const [loadingCoverage, setLoadingCoverage] = useState(false);
  const [errorCoverage, setErrorCoverage] = useState<string | null>(null);

  const [capacity, setCapacity] = useState<any | null>(null);
  const [loadingCapacity, setLoadingCapacity] = useState(false);
  const [errorCapacity, setErrorCapacity] = useState<string | null>(null);

  const [dimensioning, setDimensioning] = useState<any | null>(null);
  const [loadingDimensioning, setLoadingDimensioning] = useState(false);
  const [errorDimensioning, setErrorDimensioning] = useState<string | null>(null);


  useEffect(() => {
    let mounted = true;
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const { getProject } = await import("@/services/project");
        const data = await getProject(id as string);
        if (mounted) setProject(data);
      } catch (e: any) {
        setError(e.message || "Erreur lors du chargement du projet");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (id) fetchProject();
    return () => { mounted = false; };
  }, [id]);

  // Appels backend au montage (ou sur clic si tu préfères)
  useEffect(() => {
    if (!project) return;
    // Couverture
    const fetchCoverage = async () => {
      setLoadingCoverage(true);
      setErrorCoverage(null);
      try {
        const { calculateCoverage } = await import("@/services/project");
        // Paramètres à ajuster selon ton besoin (exemple)
        const params = {
          gainAntenne: 15,
          pertesSysteme: 3,
          fadingMargin: 6
        };
        const data = await calculateCoverage(project.id, params);
        setCoverage(data.result);
      } catch (e: any) {
        setErrorCoverage(e.message || "Erreur lors du calcul de couverture");
      } finally {
        setLoadingCoverage(false);
      }
    };
    // Capacité
    const fetchCapacity = async () => {
      setLoadingCapacity(true);
      setErrorCapacity(null);
      try {
        const { calculateCapacity } = await import("@/services/project");
        const params = {
          SNR: 10,
          modulation: "64QAM",
          debitParUtilisateur: 20
        };
        const data = await calculateCapacity(project.id, params);
        setCapacity(data.result);
      } catch (e: any) {
        setErrorCapacity(e.message || "Erreur lors du calcul de capacité");
      } finally {
        setLoadingCapacity(false);
      }
    };
    // Dimensionnement
    const fetchDimensioning = async () => {
      setLoadingDimensioning(true);
      setErrorDimensioning(null);
      try {
        const { calculateDimensionnement } = await import("@/services/project");
        const params = {
          coutParGnodeb: 20000,
          devise: "EUR"
        };
        const data = await calculateDimensionnement(project.id, params);
        setDimensioning(data.result);
      } catch (e: any) {
        setErrorDimensioning(e.message || "Erreur lors du calcul de dimensionnement");
      } finally {
        setLoadingDimensioning(false);
      }
    };
    fetchCoverage();
    fetchCapacity();
    fetchDimensioning();
  }, [project]);

  // Gardes de sécurité pour éviter l'accès à project null
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <span className="text-blue-700 text-lg">Chargement du projet...</span>
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <span className="text-red-600 text-lg font-semibold">{error}</span>
        </div>
      </Layout>
    );
  }
  if (!project) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <span className="text-slate-600 text-lg">Projet introuvable</span>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complété": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "En cours": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Brouillon": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white space-y-6 p-6">
  <style jsx global>{`
    .custom-tabs-list {
      background: linear-gradient(135deg, #1e293b 0%, #1e40af 60%, #0f172a 100%);
      border-radius: 12px;
      padding: 0.25rem;
    }
    .custom-tabs-trigger {
      color: #fff;
      font-weight: 600;
      background: transparent;
      border-radius: 8px;
      transition: background 0.2s, color 0.2s;
    }
    .custom-tabs-trigger[data-state="active"] {
      background: #fff;
      color: #1e293b;
      box-shadow: 0 2px 8px 0 rgba(30,64,175,0.07);
    }
    .custom-card {
      background: linear-gradient(135deg, #1e293b 0%, #1e40af 60%, #0f172a 100%);
      color: #fff;
      border: none;
    }
    .custom-card .text-slate-900, .custom-card .text-slate-800 { color: #fff !important; }
    .custom-card .text-slate-400 { color: #94a3b8 !important; }
    .custom-card .bg-white { background: #1e293b !important; border: 1px solid #334155 !important; }
    .custom-btn {
      background: #1e40af;
      color: #fff;
      border: 1px solid #1e40af;
    }
    .custom-btn:hover { background: #2563eb; border-color: #2563eb; color: #fff; }
  `}</style>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/projects")}
              className="border-slate-600 text-slate-900 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              <p className="text-slate-400 mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Link href={`/projects/${id}/edit`}>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </Link>
          </div>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="custom-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Surface</p>
                  <p className="text-2xl font-bold text-slate-900">{project.area} km²</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="custom-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Densité</p>
                  <p className="text-2xl font-bold text-slate-900">{project.userDensity}</p>
                  <p className="text-slate-400 text-xs">users/km²</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="custom-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Fréquence</p>
                  <p className="text-2xl font-bold text-slate-900">{project.frequency} GHz</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <Radio className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="custom-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Progression</p>
                  <p className="text-2xl font-bold text-slate-900">{project.progress}%</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <BarChart3 className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progression */}
        <Card className="custom-card">
          <CardHeader>
            <CardTitle className="text-slate-900">Progression du projet</CardTitle>
            <CardDescription className="text-slate-400">
              État d'avancement des calculs et analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-900">Progression globale</span>
                <span className="text-slate-400">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Navigation vers les calculs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="custom-tabs-list">
            <TabsTrigger value="overview" className="custom-tabs-trigger">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="calculations" className="custom-tabs-trigger">Calculs</TabsTrigger>
            <TabsTrigger value="results" className="custom-tabs-trigger">Résultats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="text-slate-900">Paramètres du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type de zone</span>
                    <span className="text-slate-900">{project.zoneType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bande passante</span>
                    <span className="text-slate-900">{project.bandwidth} MHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date de création</span>
                    <span className="text-slate-900">{new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="custom-card">
                <CardHeader>
                  <CardTitle className="text-slate-900">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/projects/${id}/coverage`} className="block">
                    <Button variant="outline" className="w-full justify-start custom-btn">
                      <Signal className="h-4 w-4 mr-2" />
                      Calcul de couverture
                    </Button>
                  </Link>
                  <Link href={`/projects/${id}/capacity`} className="block">
                    <Button variant="outline" className="w-full justify-start custom-btn">
                      <Zap className="h-4 w-4 mr-2" />
                      Calcul de capacité
                    </Button>
                  </Link>
                  <Link href={`/projects/${id}/map`} className="block">
                    <Button variant="outline" className="w-full justify-start custom-btn">
                      <Map className="h-4 w-4 mr-2" />
                      Visualisation cartographique
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculations" className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Couverture */}
    <Link href={`/projects/${id}/coverage`} className="block">
  <Card className="custom-card hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer">
    <CardContent className="p-6 text-center">
      <Signal className="h-12 w-12 text-blue-400 mx-auto mb-4" />
      <h3 className="text-white font-bold mb-1">Couverture</h3>
      <div className="text-slate-300 text-sm mb-2">COST-231 Hata</div>
      <Badge className="bg-emerald-700/80 text-green-300 mx-auto">Complété</Badge>
    </CardContent>
  </Card>
</Link>
    {/* Capacité */}
    <Link href={`/projects/${id}/capacity`} className="block">
  <Card className="custom-card hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer">
    <CardContent className="p-6 text-center">
      <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
      <h3 className="text-white font-bold mb-1">Capacité</h3>
      <div className="text-slate-300 text-sm mb-2">Shannon</div>
      <Badge className="bg-emerald-700/80 text-green-300 mx-auto">Complété</Badge>
    </CardContent>
  </Card>
</Link>
    {/* Dimensionnement */}
    <Link href={`/projects/${id}/dimensioning`} className="block">
  <Card className="custom-card hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer">
    <CardContent className="p-6 text-center">
      <Antenna className="h-12 w-12 text-purple-400 mx-auto mb-4" />
      <h3 className="text-white font-bold mb-1">Dimensionnement</h3>
      <div className="text-slate-300 text-sm mb-2">gNodeB</div>
      <Badge className="bg-emerald-700/80 text-green-300 mx-auto">Complété</Badge>
    </CardContent>
  </Card>
</Link>
    {/* Backhaul (placeholder) */}
    <Link href={`/projects/${id}/backhaul`} className="block">
  <Card className="custom-card hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer">
    <CardContent className="p-6 text-center">
      <Network className="h-12 w-12 text-green-400 mx-auto mb-4" />
      <h3 className="text-white font-bold mb-1">Backhaul</h3>
      <div className="text-slate-300 text-sm mb-2">Capacité</div>
      <Badge className="bg-yellow-700/80 text-yellow-200 mx-auto">En attente</Badge>
    </CardContent>
  </Card>
</Link>
  </div>
</TabsContent>


          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href={`/projects/${id}/map`}>
                <Card className="custom-card hover:border-orange-500/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Map className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-slate-900 font-semibold mb-2">Carte</h3>
                    <p className="text-slate-400 text-sm">Visualisation</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/projects/${id}/report`}>
                <Card className="custom-card hover:border-orange-500/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-slate-900 font-semibold mb-2">Rapport</h3>
                    <p className="text-slate-400 text-sm">PDF</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/projects/${id}/simulation`}>
                <Card className="custom-card hover:border-orange-500/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-slate-900 font-semibold mb-2">Simulation</h3>
                    <p className="text-slate-400 text-sm">Scénarios</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
