import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Grammatikregel,
  GrammatikregelInput,
  ImportResult,
  Lehrwerk,
  LehrwerkInput,
  Lektion,
  LektionDetail,
  LektionInput,
  Vokabel,
  VokabelInput,
} from './catalog.models';

const API = '/api/admin';

/** HTTP access to the admin catalog API. All endpoints require the ADMIN role. */
@Service()
export class CatalogService {
  private readonly http = inject(HttpClient);

  // --- Lehrwerke ---

  listLehrwerke(): Observable<Lehrwerk[]> {
    return this.http.get<Lehrwerk[]>(`${API}/lehrwerke`);
  }

  getLehrwerk(id: string): Observable<Lehrwerk> {
    return this.http.get<Lehrwerk>(`${API}/lehrwerke/${id}`);
  }

  createLehrwerk(input: LehrwerkInput): Observable<Lehrwerk> {
    return this.http.post<Lehrwerk>(`${API}/lehrwerke`, input);
  }

  updateLehrwerk(id: string, input: LehrwerkInput): Observable<Lehrwerk> {
    return this.http.put<Lehrwerk>(`${API}/lehrwerke/${id}`, input);
  }

  deleteLehrwerk(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/lehrwerke/${id}`);
  }

  // --- Lektionen ---

  listLektionen(lehrwerkId: string): Observable<Lektion[]> {
    return this.http.get<Lektion[]>(`${API}/lehrwerke/${lehrwerkId}/lektionen`);
  }

  getLektion(id: string): Observable<LektionDetail> {
    return this.http.get<LektionDetail>(`${API}/lektionen/${id}`);
  }

  createLektion(lehrwerkId: string, input: LektionInput): Observable<Lektion> {
    return this.http.post<Lektion>(`${API}/lehrwerke/${lehrwerkId}/lektionen`, input);
  }

  updateLektion(id: string, input: LektionInput): Observable<Lektion> {
    return this.http.put<Lektion>(`${API}/lektionen/${id}`, input);
  }

  deleteLektion(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/lektionen/${id}`);
  }

  // --- Vokabeln ---

  createVokabel(lektionId: string, input: VokabelInput): Observable<Vokabel> {
    return this.http.post<Vokabel>(`${API}/lektionen/${lektionId}/vokabeln`, input);
  }

  importVokabeln(lektionId: string, text: string): Observable<ImportResult> {
    return this.http.post<ImportResult>(`${API}/lektionen/${lektionId}/vokabeln/import`, { text });
  }

  updateVokabel(id: string, input: VokabelInput): Observable<Vokabel> {
    return this.http.put<Vokabel>(`${API}/vokabeln/${id}`, input);
  }

  deleteVokabel(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/vokabeln/${id}`);
  }

  // --- Grammatikregeln ---

  createGrammatikregel(lektionId: string, input: GrammatikregelInput): Observable<Grammatikregel> {
    return this.http.post<Grammatikregel>(`${API}/lektionen/${lektionId}/grammatikregeln`, input);
  }

  updateGrammatikregel(id: string, input: GrammatikregelInput): Observable<Grammatikregel> {
    return this.http.put<Grammatikregel>(`${API}/grammatikregeln/${id}`, input);
  }

  deleteGrammatikregel(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/grammatikregeln/${id}`);
  }
}
