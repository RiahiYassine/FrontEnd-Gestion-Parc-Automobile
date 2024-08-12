import { HttpClient, HttpParams } from '@angular/common/http';
import { AlerteStatus, Assurance, Carburant, Departement, Maintenance, Mission, Reparation, Status, TypeOperation, User, Vehicule, VisiteTechnique } from '../model/vehicule.model';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AulshService {

  constructor(private http : HttpClient) {}

  public getAllVehicules():Observable<Array<Vehicule>>{
    return this.http.get<Array<Vehicule>>(`${environment.backendHost}/vehicules`);
  }


  public getAllImmatriculations(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/vehiculespecifications/immatriculations`);
  }

  public getAllMarques(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/vehiculespecifications/marques`);
  }

  public getAllModeles(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/vehiculespecifications/modeles`);
  }

  public addVehicule(vehiculeData: any): Observable<any> {
    return this.http.post(`${environment.backendHost}/vehicules`, vehiculeData);
  }

  public updateVehicule(id: number, vehiculeData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/vehicules/${id}`, vehiculeData);
  }  

  public deleteVehicule(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/vehicules/${id}`);
  }

  filterVehicules(filterValues: any): Observable<Vehicule[]> {
    return this.http.post<Vehicule[]>(`${environment.backendHost}/vehicules/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  public getAllAssurances():Observable<Array<Assurance>>{
    return this.http.get<Array<Assurance>>(`${environment.backendHost}/operations/typeOperation/ASSURANCE`);
  }

  public getAllAssurancesExpired(typeOperation : TypeOperation):Observable<Array<Assurance>>{
    return this.http.get<Array<Assurance>>(`${environment.backendHost}/operations/${typeOperation}/expired`);
  }


  public getAllAssurancesActive(typeOperation : TypeOperation):Observable<Array<Assurance>>{
    return this.http.get<Array<Assurance>>(`${environment.backendHost}/operations/${typeOperation}/active`);
  }


  public deleteAssurance(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/operations/${id}`);
  }

  

  public getAllCentres(typeOperation:TypeOperation): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/operations/${typeOperation}/centres`);
  }
  
  public getAllImmatriculationsByTypeOperations(typeOperation:TypeOperation): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/operations/${typeOperation}/immatriculations`);
  }

  public getAllMarquesByTypeOperations(typeOperation:TypeOperation): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/operations/${typeOperation}/marques`);
  }

  public getAllModelesByTypeOperations(typeOperation:TypeOperation): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/operations/${typeOperation}/modeles`);
  }

  public getAllCarburantsByTypeOperations(typeOperation:TypeOperation): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/operations/${typeOperation}/carburants`);
  }
  

  filterAssurancesExpired(filterValues: any): Observable<Assurance[]> {
    return this.http.post<Assurance[]>(`${environment.backendHost}/operations/assurances/expired/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  filterAssurancesActive(filterValues: any): Observable<Assurance[]> {
    return this.http.post<Assurance[]>(`${environment.backendHost}/operations/assurances/active/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  public addAssurance(assuranceData: FormData): Observable<any> {
    return this.http.post(`${environment.backendHost}/operations`, assuranceData,{
      headers: {
        'Accept': 'application/json'
      }
    });
  }



  rescheduleExpiredAssuranceById(id: number): Observable<any> {
    return this.http.put(`${environment.backendHost}/operations/assurances/reschedule/${id}`, {});
  }



  filterVisiteTechniquesExpired(filterValues: any): Observable<VisiteTechnique[]> {
    return this.http.post<VisiteTechnique[]>(`${environment.backendHost}/operations/visitetechniques/expired/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  filterVisiteTechniqueActive(filterValues: any): Observable<VisiteTechnique[]> {
    return this.http.post<VisiteTechnique[]>(`${environment.backendHost}/operations/visitetechniques/active/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  public getAllVisiteTechniquesExpired(typeOperation : TypeOperation):Observable<Array<VisiteTechnique>>{
    return this.http.get<Array<VisiteTechnique>>(`${environment.backendHost}/operations/${typeOperation}/expired`);
  }
  
  public getAllVisiteTechniquesActive(typeOperation : TypeOperation):Observable<Array<VisiteTechnique>>{
    return this.http.get<Array<VisiteTechnique>>(`${environment.backendHost}/operations/${typeOperation}/active`);
  }

  rescheduleExpiredVisiteTechniqueById(id: number): Observable<any> {
    return this.http.put(`${environment.backendHost}/operations/visiteTechniques/reschedule/${id}`, {});
  }


  public deleteVisiteTechnique(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/operations/${id}`);
  }



  filterReparations(filterValues: any): Observable<Reparation[]> {
    return this.http.post<Reparation[]>(`${environment.backendHost}/operations/reparations/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  public getAllReparations(typeOperation : TypeOperation):Observable<Array<Reparation>>{
    return this.http.get<Array<Reparation>>(`${environment.backendHost}/operations/typeOperation/${typeOperation}`);
  }


  public deleteReparation(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/operations/${id}`);
  }


  filterMaintenances(filterValues: any): Observable<Maintenance[]> {
    return this.http.post<Maintenance[]>(`${environment.backendHost}/operations/maintenances/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  public getAllMaintenances(typeOperation : TypeOperation):Observable<Array<Maintenance>>{
    return this.http.get<Array<Maintenance>>(`${environment.backendHost}/operations/typeOperation/${typeOperation}`);
  }

  public deleteMaintenance(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/operations/${id}`);
  }


  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${environment.backendHost}/operations/${id}/file`, { responseType: 'blob' });
  }


  public updateAssurance(id: number, formData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/operations/${id}`, formData);
  }  

  public addVisiteTechnique(visiteTechniqueData: FormData): Observable<any> {
    return this.http.post(`${environment.backendHost}/operations`, visiteTechniqueData);
  }
  

  public updateVisiteTechnique(id: number, formData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/operations/${id}`, formData);
  }  

  public addReparation(reparationData: FormData): Observable<any> {
    return this.http.post(`${environment.backendHost}/operations`, reparationData);
  }

  public updateReparation(id: number, formData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/operations/${id}`, formData);
  }  

  public updateMaintenance(id: number, formData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/operations/${id}`, formData);
  }

  public addMaintenance(reparationData: FormData): Observable<any> {
    return this.http.post(`${environment.backendHost}/operations`, reparationData);
  }


  public getAllDepartements():Observable<Array<Departement>>{
    return this.http.get<Array<Departement>>(`${environment.backendHost}/departements`);
  }
  


  public deleteDepartement(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/departements/${id}`);
  }

  

  
  public getEmployesByDepartementId(id : number):Observable<Array<User>>{
    return this.http.get<Array<User>>(`${environment.backendHost}/users/employes/departement/${id}`);
  }

  public getAllMissions():Observable<Array<Mission>>{
    return this.http.get<Array<Mission>>(`${environment.backendHost}/missions`);
  }


  rejectAffectation(id: number, data: { motif: string }): Observable<any> {
    return this.http.put(`${environment.backendHost}/affectations/${id}/reject`, data);
  }

  assignVehicleToAffectation(id: number, data: { motif: string, vehiculeId: number }): Observable<any> {
    return this.http.put(`${environment.backendHost}/affectations/${id}/accept`, data);
  }

  getAvailableVehicles(startDate: string, endDate: string): Observable<Vehicule[]> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<Vehicule[]>(`${environment.backendHost}/vehicules/available`, { params });
  }
  

  public addDepartement(departementnData: FormData): Observable<any> {
    return this.http.post(`${environment.backendHost}/departements`, departementnData);
  }


  
  public updateDepartement(id: number, departementData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/vehicules/${id}`, departementData);
  }



  public getAllReferences(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/missions/references`);
  }

  public getAllDestinations(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/missions/destinations`);
  }


  public getAllMatricules(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/missions/matricules`);
  }


  public getAllDepartementlibelle(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/missions/departements`);
  }


  public getAllResponsable(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/missions/responsables`);
  }


  public getAllChauffeur(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/missions/chauffeurs`);
  }

  
  filterMission(filterValues: any): Observable<Mission[]> {
    return this.http.post<Mission[]>(`${environment.backendHost}/missions/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  //new

  getCostsByYear(year: number): Observable<any> {
    return this.http.get(`${environment.backendHost}/operations/costs/${year}`);
  }


  public addMission(missionData: FormData): Observable<any> {
    return this.http.post(`${environment.backendHost}/missions`, missionData);
  }


  getAllEmployesByDepartement(departementId: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.backendHost}/users/employes/departement/${departementId}`);
  }

  public getAllMissionsByDepartement(departementId:number):Observable<Array<Mission>>{
    return this.http.get<Array<Mission>>(`${environment.backendHost}/missions/departement/${departementId}`);
  }


  filterMissionDepartement(departementId:number , filterValues: any): Observable<Mission[]> {
    return this.http.post<Mission[]>(`${environment.backendHost}/missions/departement/filter/${departementId}`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  
  public deleteEmploye(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/users/employes/${id}`);
  }


  filterEmploye(id:number,filterValues: any): Observable<User[]> {
    return this.http.post<User[]>(`${environment.backendHost}/users/employes/filter/${id}`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  
  public getEmployeById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.backendHost}/users/employes/${id}`);
  }
  

  public updateMission(id: number, missionData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/missions/${id}`, missionData);
  }  
  


  public addEmploye(employeData: any): Observable<any> {
    return this.http.post(`${environment.backendHost}/users`, employeData);
  }

  

  public updateEmploye(id: number, employeData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/users/employes/${id}`, employeData);
  }  


  public getAllMissionsAccepter():Observable<Array<Mission>>{
    return this.http.get<Array<Mission>>(`${environment.backendHost}/missions/accepter`);
  }

  public getAllMissionsRefuser():Observable<Array<Mission>>{
    return this.http.get<Array<Mission>>(`${environment.backendHost}/missions/refuser`);
  }
  


  filterMissionAccepter(filterValues: any): Observable<Mission[]> {
    return this.http.post<Mission[]>(`${environment.backendHost}/missions/accepter/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  filterMissionRefuser(filterValues: any): Observable<Mission[]> {
    return this.http.post<Mission[]>(`${environment.backendHost}/missions/refuser/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }





  filterCarburants(filterValues: any): Observable<Carburant[]> {
    return this.http.post<Carburant[]>(`${environment.backendHost}/operations/carburants/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  public getAllCarburants(typeOperation : TypeOperation):Observable<Array<Carburant>>{
    return this.http.get<Array<Carburant>>(`${environment.backendHost}/operations/typeOperation/${typeOperation}`);
  }


  public deleteCarburant(id: number): Observable<any> {
    return this.http.delete(`${environment.backendHost}/operations/${id}`);
  }

  public addCarburant(carburantData: FormData): Observable<any> {
    return this.http.post(`${environment.backendHost}/operations`, carburantData);
  }

  
  public updateCarburant(id: number, formData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/operations/${id}`, formData);
  }  


  public updateKilometrage(id: number, formData: any): Observable<any> {
    return this.http.put(`${environment.backendHost}/affectations/kilometrage/${id}`, formData);
  }  


  filterAlertesEnCour(filterValues: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.backendHost}/alertes/encour/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  filterAlertesDone(filterValues: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.backendHost}/alertes/done/filter`, filterValues)
      .pipe(
        catchError(error => {
          let errorMsg = 'An error occurred';
          if (error.status === 404) {
            errorMsg = error.error;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }


  public getAllTypeAlertes(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/alertes/types`);
  }

  public getAllAlertesMatricules(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.backendHost}/alertes/immatriculations`);
  }



 public getFinishedAlertes(status : AlerteStatus):Observable<any[]>{
    return this.http.get<any[]>(`${environment.backendHost}/alertes/status/${status}`);
 }
 
 public getAlertesEnCour(status : AlerteStatus):Observable<any[]>{
  return this.http.get<any[]>(`${environment.backendHost}/alertes/status/${status}`);
}


public addAlerte(alerteData: any): Observable<any> {
  return this.http.post(`${environment.backendHost}/alertes`, alerteData);
}
  

public deleteAlerte(id: number): Observable<any> {
  return this.http.delete(`${environment.backendHost}/alertes/${id}`);
}


public finishAlerte(id: number): Observable<any> {
  return this.http.get(`${environment.backendHost}/alertes/${id}/finish`);
}


public updateAlerte(id: number, alerteData: any): Observable<any> {
  return this.http.put(`${environment.backendHost}/alertes/${id}`, alerteData);
} 


public getAlertesOfMissionAcceptedByDepartement(departementId : number): Observable<Mission[]> {
  return this.http.get<Mission[]>(`${environment.backendHost}/alertes/missions/${departementId}`);
}

}