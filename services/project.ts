// Service pour la gestion des projets (CRUD)
import { getAuthHeaders } from "./auth";

// Calculs backend : Couverture
export async function calculateCoverage(projectId: string, params: any) {
  const res = await fetch(`http://localhost:4000/api/results/calculate-coverage/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(params)
  });
  let data: any = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.error || "Erreur lors du calcul de couverture");
  return data;
}

// Calculs backend : Capacité
export async function calculateCapacity(projectId: string, params: any) {
  const res = await fetch(`http://localhost:4000/api/results/calculate-capacity/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(params)
  });
  let data: any = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.error || "Erreur lors du calcul de capacité");
  return data;
}

// Calculs backend : Dimensionnement
export async function calculateDimensionnement(projectId: string, params: any) {
  const res = await fetch(`http://localhost:4000/api/results/calculate-dimensionnement/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(params)
  });
  let data: any = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.error || "Erreur lors du calcul de dimensionnement");
  return data;
}


export async function getProject(id: string) {
  const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors du chargement du projet');
  return res.json();
}

export async function createProject(data: any) {
  console.log(data);
  console.log(getAuthHeaders());
  const res = await fetch('http://localhost:4000/api/projects/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de la création du projet');
  return res.json();
}

export async function listProjects() {
  const res = await fetch('http://localhost:4000/api/projects', {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors du chargement des projets');
  return res.json();
}

export async function updateProject(id: string, data: any) {
  const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de la modification du projet');
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur lors de la suppression du projet');
  return res.json();
}
