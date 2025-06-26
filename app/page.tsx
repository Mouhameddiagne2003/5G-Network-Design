import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Antenna, 
  Calculator, 
  MapPin, 
  BarChart2, 
  FileText, 
  Users,
  Signal,
  Settings,
  ArrowRight
} from "lucide-react";
import Link from "next/link"

export default function Index() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Antenna className="h-8 w-8 text-orange-400" />
          <span className="text-2xl font-bold text-white">5G Network Designer</span>
        </div>
        <div className="space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:text-orange-400">
              Se connecter
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              S'inscrire
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
            Nouvelle génération
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Dimensionnez votre
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 font-bold"> réseau 5G </span>
            facilement
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Outil professionnel de planification et dimensionnement de réseaux 5G.
            Calculez la couverture, optimisez la capacité et générez des rapports détaillés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 px-8 py-3">
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <Calculator className="h-12 w-12 text-orange-400 mb-4" />
              <CardTitle className="text-white">Calculs de Couverture</CardTitle>
              <CardDescription className="text-slate-400">
                Modèles COST-231 Hata et 3GPP pour sub-6 GHz et mmWave
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Portée maximale des gNodeB</li>
                <li>• Surface couverte par station</li>
                <li>• Perte de propagation optimisée</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <BarChart2 className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Calculs de Capacité</CardTitle>
              <CardDescription className="text-slate-400">
                Formule de Shannon et efficacité spectrale avancée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Débit théorique par utilisateur</li>
                <li>• Nombre d'utilisateurs supportés</li>
                <li>• Capacité totale optimisée</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <Signal className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Dimensionnement</CardTitle>
              <CardDescription className="text-slate-400">
                Estimation précise des ressources nécessaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Nombre de gNodeB optimal</li>
                <li>• Besoins en backhaul</li>
                <li>• Allocation des ressources radio</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <MapPin className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Visualisation</CardTitle>
              <CardDescription className="text-slate-400">
                Cartes interactives et zones de couverture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Cartes Leaflet intégrées</li>
                <li>• Zones de couverture visuelles</li>
                <li>• Emplacements optimaux</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <FileText className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Rapports PDF</CardTitle>
              <CardDescription className="text-slate-400">
                Documentation complète et recommandations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Résumé des calculs</li>
                <li>• Recommandations techniques</li>
                <li>• Export professionnel</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-cyan-400 mb-4" />
              <CardTitle className="text-white">Gestion de Projets</CardTitle>
              <CardDescription className="text-slate-400">
                Sauvegarde et collaboration sur vos projets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Projets sauvegardés</li>
                <li>• Historique des calculs</li>
                <li>• Partage d'équipe</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl p-12 border border-orange-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à dimensionner votre réseau 5G ?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Rejoignez les professionnels qui utilisent notre outil pour planifier 
            et optimiser leurs déploiements 5G.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-lg">
              Commencer maintenant
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Antenna className="h-6 w-6 text-orange-400" />
              <span className="text-lg font-semibold text-white">5G Network Designer</span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <a href="#" className="hover:text-orange-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Support</a>
              <a href="#" className="hover:text-orange-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700 text-center text-slate-500">
            <p>&copy; 2024 5G Network Designer. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};