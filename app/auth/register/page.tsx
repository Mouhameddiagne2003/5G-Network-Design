"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Antenna, Mail, Lock, User } from "lucide-react";
import { register } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validate = () => {
    if (!username) return "Nom d'utilisateur requis";
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) return "Email invalide";
    if (!password || password.length < 6) return "Mot de passe : au moins 6 caractères";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = validate();
    if (err) { setError(err); return; }
    setIsLoading(true);
    try {
      const data = await register(username, email, password);
      useAuthStore.getState().setUser(data.user);
      useAuthStore.getState().setToken(data.token || null);
      router.push("/auth/login");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-orange-400 transition-colors">
            <Antenna className="h-8 w-8" />
            <span className="text-2xl font-bold">5G Network Designer</span>
          </Link>
        </div>
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Créer un compte</CardTitle>
            <CardDescription className="text-slate-400">
              Rejoignez les experts en dimensionnement 5G
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Nom d'utilisateur</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Votre nom d'utilisateur"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-slate-400">Au moins 6 caractères</p>
              </div>
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Création..." : "Créer un compte"}
              </Button>
              <div className="text-center">
                <p className="text-slate-400">
                  Déjà un compte ?{" "}
                  <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-medium">
                    Se connecter
                  </Link>
                </p>
                <Link href="/" className="inline-block mt-6 text-slate-400 hover:text-orange-400 font-medium transition-colors">
                  ← Retour à l'accueil
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
