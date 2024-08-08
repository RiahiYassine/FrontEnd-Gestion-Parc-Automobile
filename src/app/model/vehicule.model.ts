export interface Marque {
  id: number;
  nomMarque: string;
  modelesAssocies?: any;
}

export interface Modele {
  id: number;
  nomModele: string;
  marque: Marque;
}

export interface VehiculeSpecif {
  id: number;
  immatriculation: string;
  kilometrage: number;
  modele: Modele;
  nombreDePlaces: number;
  numeroChassis: string;
  poids: number;
  puissance: number;
  typeCarburant: TypeCarburant;
  typeImmatriculation: string;
}

export interface Vehicule {
  id: number;
  dateEntree: Date;
  statusVehicule: StatusVehicule;
  vehiculeSpecif: VehiculeSpecif;
}



export interface Maintenance {
  id: number;
  dateOperation: Date;
  nomCentre: String;
  details:String;
  cout:number;
  vehicul:Vehicule;
  nomFichier:String;
  categorieMaintenance:CategorieMaintenance;
  //donneesFichier:byte[];
  typeOperation:TypeOperation;
}


export interface Carburant {
  id: number;
  dateOperation: Date;
  nomCentre: String;
  details:String;
  cout:number;
  vehicul:Vehicule;
  nomFichier:String;
  typeOperation:TypeOperation;
}

export interface Reparation {
  id: number;
  dateOperation: Date;
  nomCentre: String;
  details:String;
  cout:number;
  vehicul:Vehicule;
  nomFichier:String;
  //donneesFichier:byte[];
  typeOperation:TypeOperation;
}

export interface VisiteTechnique {
  id: number;
  dateOperation: Date;
  dateFinValidite:Date;
  nomCentre: String;
  details:String;
  cout:number;
  immatriculation:String;
  nomFichier:String;
  //donneesFichier:byte[];
  typeOperation:TypeOperation;
}

export interface Assurance {
  id: number;
  dateOperation: Date;
  dateFinValidite:Date;
  nomCentre: String;
  details:String;
  cout:number;
  vehicule:Vehicule;
  file:Uint8Array;
  typeOperation:TypeOperation;
  vehiculeSpecif: VehiculeSpecif;
}

export enum CategorieMaintenance {
  MECANIQUE = "MECANIQUE",
  TOLERIE = "TOLERIE",
  ELECTRIQUE = "ELECTRIQUE",
}


export enum SeverityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum AlerteStatus {
  DONE = "DONE",
  NOT_DONE = "NOT_DONE",
}


export enum StatusVehicule {
  EN_PARC = "EN_PARC",
  EN_SERVICE = "EN_SERVICE"
}


export enum TypeOperation {
  ASSURANCE = "ASSURANCE",
  MAINTENANCE = "MAINTENANCE",
  REPARATION = "REPARATION",
  VISITE_TECHNIQUE = "VISITE_TECHNIQUE",
  CARBURANT = "CARBURANT"
}


export enum TypeCarburant{
  DIESEL = 'DIESEL',
  ESSENCE = 'ESSENCE',
  HYBRIDEESSENCE = 'HYBRIDEESSENCE',
  HYBRIDEDIESEL = 'HYBRIDEDIESEL',
  HYDROGENE = 'HYDROGENE',
  ELECTRIQUE = 'ELECTRIQUE'
}

export enum TypeImmatriculation{
  CIVIL = 'CIVIL',
  MROUGE = 'MROUGE'
}



export interface Departement {
  id: number;
  libelle: string;
  description:string;
  chef:User;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  password: string;
  role: RoleUser;
  grade: Grade;
  departement?: Departement; // Optional, since it might not be available for all users
}


export interface Mission{
  id:number;
  reference:string;
  destination:string;
  objectif:string;
  dateDebut:Date;
  dateFin:Date;
  dateOrder:Date;
  responsable:User;
  chauffeur:User;
  departement:Departement;
  affectation:Affectation;
  accompagnants:Array<User>;

}


export interface MissionRequest{
  reference:string;
  destination:string;
  objectif:string;
  dateDebut:Date;
  dateFin:Date;
  responsableId:number;
  chauffeurId:number;
  departementId:number;
  accompagnantsIds:Array<number>;

}


export interface Affectation{
  id:number;
  vehicule:Vehicule;
  status:Status;
  dateReaction:Date;
  motif:string;
}


export enum Grade{
  A = "A",
  B = "B",
  C = "C"
}

export enum Status{
  NON_TRAITE = "NON_TRAITE",
  ACCEPTE = "ACCEPTE",
  REFUSE = "REFUSE"
}

export enum RoleUser {
  CHEF_PARC = 'CHEF_PARC',
  EMPLOYE = 'EMPLOYE',
  CHEF_DEPARTMENT = 'CHEF_DEPARTMENT'
}