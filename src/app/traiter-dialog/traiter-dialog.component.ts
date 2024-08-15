import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vehicule } from '../model/vehicule.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-traiter-dialog',
  templateUrl: './traiter-dialog.component.html',
  styleUrl: './traiter-dialog.component.css'
})
export class TraiterDialogComponent implements OnInit{
[x: string]: any;


  form: FormGroup;
  availableVehicles: Vehicule[] = [];


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TraiterDialogComponent>,
    private aulshService: AulshService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, dateDebut: string, dateFin: string }
  ) {
    this.form = this.fb.group({
      motif: [null, Validators.required],
      vehiculeId: [null]
    });
  }

  ngOnInit(): void {
    this.loadAvailableVehicles();
  }


  loadAvailableVehicles(): void {
    this.aulshService.getAvailableVehicles(this.data.dateDebut, this.data.dateFin).subscribe({
      next: vehicles => {
        this.availableVehicles = vehicles;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des véhicules disponibles', 'Close', { duration: 3000 });
      }
    });
  }

  onReject(): void {
    const motif = this.form.get('motif')?.value;
    this.aulshService.rejectAffectation(this.data.id, { motif }).subscribe({
      next: () => {
        this.snackBar.open('Affectation rejetée avec succès', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open("Erreur lors du rejet de l'affectation", 'Close', { duration: 3000 });
      }
    });
  }


  onAccept(): void {
    const motif = this.form.get('motif')?.value;
    const vehiculeId = this.form.get('vehiculeId')?.value;
    this.aulshService.assignVehicleToAffectation(this.data.id, { motif, vehiculeId }).subscribe({
      next: response => {
        console.log("Response structure:", response); // Inspect the response structure
  
        this.snackBar.open('Affectation acceptée avec succès', 'Close', { duration: 3000 });
  
        const reference = response.mission.reference || 'No Reference';
        const responsable = (response.mission.responsable.nom || 'No Responsable') + ' ' + (response.mission.responsable.prenom || '');
        const conducteur = response.mission.chauffeur
        const departementLibelle = response.mission.departement.libelle || 'No Department';
        const grade = response.mission.responsable.grade || 'No Grade';
        const marque = response.vehicule.vehiculeSpecif.modele.marque.nomMarque || 'No Brand';
        const matricule = response.vehicule.vehiculeSpecif.immatriculation || 'No Matricule';
        const typeVehicule = response.vehicule.vehiculeSpecif.typeImmatriculation || 'No Type';
        const destination = response.mission.destination || 'No Destination';
        const objectif = response.mission.objectif || 'No Objective';
        const dateDebut = response.mission.dateDebut || 'No Start Date';
        const dateFin = response.mission.dateFin || 'No End Date';
        const listAccompagnant = response.listAccompagnant || [];


        const doc = new jsPDF();

      // Set document properties
        doc.setProperties({
            title: 'Order de Mission',
            subject: 'Mission Details',
            author: 'Your Organization',
            keywords: 'mission, order, travel',
            creator: 'Your Application'
        });

        //---

        const pageWidth2 = 210; // A4 page width in mm

        // Header - First Line
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');

        let text = 'ROYAUME DU MAROC';
        let textWidth2 = doc.getTextWidth(text);
        let y = (pageWidth2 - textWidth2) / 2;
        doc.text(text, y, 10);

        // Header - Second Line
        doc.setFont('helvetica', 'normal');
        text = "MINISTÈRE DE L'HABITAT, DE L'URBANISME";
        textWidth2 = doc.getTextWidth(text);
        y = (pageWidth2 - textWidth2) / 2;
        doc.text(text, y, 17);

        // Header - Third Line
        text = "ET DE L'AMÉNAGEMENT DE L'ESPACE";
        textWidth2 = doc.getTextWidth(text);
        y = (pageWidth2 - textWidth2) / 2;
        doc.text(text, y, 24);

        // Reset text color and font
        

        let yOffset = 40;


        ///Title----

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('Order de Mission',15,yOffset)
        yOffset += 10;
        ///---
        
///---

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        doc.setFont('helvetica', 'bold');

        // Calculate the width of the text
        const referenceText = `Reference: ${reference}`;
        const textWidth = doc.getTextWidth(referenceText);

        // Calculate the horizontal center for the text (A4 width is 210mm)
        const pageWidth = 210;
        const x = (pageWidth - textWidth) / 2;

        // Add the text to the PDF at the calculated center position
        doc.text(referenceText, x, yOffset);

        // Increase the yOffset for the next line
        yOffset += 15;
///---


        // Responsable details
        doc.setFont('helvetica', 'bold');
        doc.text('IL est ordonné à :', 15, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(`${responsable}`, 55, yOffset);
        doc.setFont('helvetica', 'bold');
        doc.text('responsable de la mission.', 120, yOffset);
        yOffset += 15;
        doc.setFont('helvetica', 'bold');
        doc.text(`Affectation: `, 15, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(`${departementLibelle}`, 40, yOffset);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grade: `, 120, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(`${grade}`, 140, yOffset);
        yOffset += 15;

        // Accompaniments
        doc.setFont('helvetica', 'bold');
        doc.text('Personnes accompagnant :', 15, yOffset);
        yOffset += 10;

        doc.setFont('helvetica', 'bold');
        doc.text('M: ', 80, yOffset);

        doc.setFont('helvetica', 'normal');
        doc.text(`${conducteur.nom} ${conducteur.prenom}`, 90, yOffset);
        doc.setFont('helvetica', 'bold');
        doc.text(': Conducteur', 150, yOffset);
        yOffset += 7;
        
        listAccompagnant.forEach((accompagnant: { nom: any; prenom: any; }) => {
            doc.setFont('helvetica', 'bold');
            doc.text('M: ', 80, yOffset);
            doc.setFont('helvetica', 'normal');
            doc.text(`${accompagnant.nom} ${accompagnant.prenom}`, 90, yOffset);
            doc.setFont('helvetica', 'bold');
            doc.text(': ', 150, yOffset);
            doc.setFont('helvetica', 'normal');
            doc.text('................................ ', 152, yOffset);
            yOffset += 7;
        });
        yOffset += 15;

        if(typeVehicule=="MROUGE"){
          doc.setFont('helvetica', 'bold');
          doc.text('Véhicule de service: ', 15, yOffset);
          
        }else{
          doc.setFont('helvetica', 'bold');
          doc.text('Véhicule personnel autorisé: ', 15, yOffset);
        }

        doc.setFont('helvetica', 'bold');
        doc.text('Marque: ', 80, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(`${marque}`, 100, yOffset);

        doc.setFont('helvetica', 'bold');
        doc.text('Matricule: ', 140, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(`${matricule}`, 165, yOffset);
        
        yOffset += 15;
        
        doc.setFont('helvetica', 'bold');
        doc.text(`Pour se rendre en mission à : `, 15, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(`${destination}`, 80, yOffset);
        yOffset += 10;
        doc.setFont('helvetica', 'bold');
        doc.text(`Motif du déplacement :`, 15, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(`${objectif}`, 80, yOffset);
        yOffset += 10;
        doc.setFont('helvetica', 'bold');
        doc.text(`Date de Débart:`, 25, yOffset);
        doc.setFont('helvetica', 'normal');
        const formattedDateDepart = dateDebut.split('-').reverse().join('/');
        doc.text(`${formattedDateDepart}`, 60, yOffset);
        doc.setFont('helvetica', 'bold');
        doc.text(`A  `, 85, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(` ................................ `, 90, yOffset);
        yOffset += 10;
        doc.setFont('helvetica', 'bold');
        doc.text(`Date de Retour: `, 25, yOffset);
       
        doc.setFont('helvetica', 'normal');
        doc.setFont('helvetica', 'normal');
        const formattedDateFin = dateFin.split('-').reverse().join('/');
        doc.text(`${formattedDateFin}`, 60, yOffset); 
        doc.setFont('helvetica', 'bold');
        doc.text(`A  `, 85, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(` ................................ `, 90, yOffset);

        yOffset += 15;
        doc.setFont('helvetica', 'bold');
        doc.text('Fait à Laàyoune le ' + new Date().toLocaleDateString(), 105, yOffset);

        yOffset += 20;

        doc.setFont('helvetica', 'bold');
        doc.text(`Le chef de Département:`, 25, yOffset);



        doc.setFont('helvetica', 'bold');
        doc.text(`D.A.F:`, 140, yOffset);
        yOffset += 40;
        

        doc.setFont('helvetica', 'normal');
        doc.text(`*Les autorités sont priées de donnée leur aide pour l'accomplissement de cette mission`, 15, yOffset);
        yOffset += 2;
        // Draw a horizontal line across the page
        doc.setDrawColor(0, 0, 0); // Set the color of the line (black in this case)
        doc.line(10, yOffset, 200, yOffset); // Draw the line from x=10 to x=200 at the current yOffset

        yOffset += 5; // Adjust the vertical spacing after the line

        // Footer - First Line
        let text3 = 'Agence Urbaine de Laayoune';
        let textWidth3 = doc.getTextWidth(text3);
        let z = (pageWidth - textWidth) / 2;
        doc.text(text3, x, yOffset);
        yOffset += 7; // Adjust the vertical spacing for the next line

        // Footer - Second Line
        text3 = 'Place de la résistance C.P 70000 B.P 800 TEL: 05 28 89 18 12 / 05 28 89 25 55 Fax : 05 28 89 19 99';
        doc.text(text3, 15, yOffset);
        yOffset += 7; // Adjust the vertical spacing for the next line

        // Footer - Third Line
        text3 = 'E-MAIL: aaulaay@menara.ma';
        textWidth3 = doc.getTextWidth(text3);
        z = (pageWidth - textWidth) / 2;
        doc.text(text3, x, yOffset);


        // Save the PDF
        doc.save('ordre_de_mission.pdf');
  
        console.log("Closing dialog");
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error accepting affectation', 'Close', { duration: 3000 });
      }
    });

  }
}
