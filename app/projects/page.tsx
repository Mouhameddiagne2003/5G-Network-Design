"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, MapPin, Users, Signal } from "lucide-react";
import { Layout } from "@/components/Layout";

import { useAuthStore } from "@/stores/authStore";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || user?.userId;

  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { listProjects } = await import("@/services/project");
        const data = await listProjects();
        // Si le backend filtre déjà par user, pas besoin de filtrer ici
        // Sinon, filtre côté client
        setProjects(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || "Erreur lors du chargement des projets");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProjects();
    return () => { mounted = false; };
  }, []);

  const userProjects = projects.filter((p) => !userId || p.userId === userId);



  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complété": return "bg-green-100 text-green-700 border-green-300";
      case "En cours": return "bg-blue-100 text-blue-700 border-blue-300";
      case "Brouillon": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Mes Projets</h1>
            <p className="text-slate-500 mt-2">
              Gérez vos projets de dimensionnement de réseau 5G
            </p>
          </div>
          <Link href="/projects/new">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm">Total Projets</p>
                  <p className="text-2xl font-bold text-blue-900">{projects.length}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-lg">
                  <Signal className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm">Projets Complétés</p>
                  <p className="text-2xl font-bold text-green-900">
                    {projects.filter(p => p.status === "Complété").length}
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm">Surface Totale</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {projects.reduce((sum, p) => sum + p.area, 0).toFixed(1)} km²
                  </p>
                </div>
                <div className="bg-purple-200 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-sm">Utilisateurs Total</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {projects.reduce((sum, p) => sum + (p.area * p.userDensity), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-200 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white border border-slate-200 hover:border-orange-400 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-blue-900 text-xl">{project.name}</CardTitle>
                    <CardDescription className="text-slate-500 mt-2">
                      Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-slate-500 text-sm">Surface</p>
                    <p className="text-blue-900 font-semibold">{project.area} km²</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Densité</p>
                    <p className="text-blue-900 font-semibold">{project.userDensity} users/km²</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Fréquence</p>
                    <p className="text-blue-900 font-semibold">{project.frequency} GHz</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Bande passante</p>
                    <p className="text-blue-900 font-semibold">{project.bandwidth} MHz</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="border-slate-300 text-blue-900 hover:bg-blue-50">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                  </Link>
                  <Link href={`/projects/${project.id}/edit`}>
                    <Button variant="outline" size="sm" className="border-slate-300 text-blue-900 hover:bg-blue-50">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {userProjects.length === 0 && (
          <Card className="bg-blue-50 border-blue-100 text-center py-12">
            <CardContent>
              <Signal className="h-16 w-16 text-blue-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Aucun projet</h3>
              <p className="text-slate-500 mb-6">
                Créez votre premier projet de dimensionnement 5G
              </p>
              <Link href="/projects/new">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un projet
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
