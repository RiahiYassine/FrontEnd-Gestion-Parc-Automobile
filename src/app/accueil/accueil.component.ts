import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AulshService } from '../services/aulsh.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { CardsInfo, TopCard } from '../model/vehicule.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @ViewChild('generalChartCanvas') generalChartCanvas!: ElementRef;

  statistics: any[] = [];
  year: number = 2024;

  selectedOperationType: string = '';

  cards: CardsInfo = { vehicule: 0, departement: 0, employes: 0, alertes: 0, missionsEnCour: 0, demandesMission: 0 };
  topcards: TopCard[] = [];

  chart!: Chart;
  generalChart!: Chart;
  displayedColumns: string[] = ['type', 'year', 
    'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 
    'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 
    'total'
  ];

  operationTypes: string[] = ['ASSURANCE', 'VISITE_TECHNIQUE', 'MAINTENANCE', 'REPARATION','CARBURANT'];

  constructor(private aulshService: AulshService, private router: Router) { }

  onSubmit(): void {
    this.getStatisticsByType(this.year); // Récupérer les statistiques en fonction de l'année sélectionnée et du type d'opération
  }

  getStatisticsByType(year: number): void {
    this.aulshService.getCostsByYear(year).subscribe(
      (data) => {
        this.statistics = this.selectedOperationType
          ? data.filter((stat: { type: string; }) => stat.type === this.selectedOperationType)
          : data;
        this.updateChartData();
        this.updateGeneralChartData();
      },
      (error) => {
        console.error('Il y a eu une erreur lors de la récupération des statistiques!', error);
      }
    );
  }

  ngOnInit(): void {
    this.getStatistics(this.year);
    this.loadCardData(); // Charger les données des cartes à l'initialisation
  }

  loadCardData(): void {
    this.aulshService.getAllCardsInfo().subscribe({
      next: value => {
        this.cards = value;

        this.topcards = [
          {
            id: 1,
            color: 'primary',
            img: '../../assets/images/svgs/sedan.png',
            title: 'Véhicules',
            subtitle: `${this.cards.vehicule}`,
            path: '/admin/vehicules'
          },

          {
            id: 2,
            color: 'accent',
            img: '../../assets/images/svgs/notification.png',
            title: 'Alertes',
            subtitle: `${this.cards.alertes}`,
            path: '/admin/alertes'
          },

          {
            id: 3,
            color: 'error',
            img: '../../assets/images/svgs/assignment.png',
            title: 'Demandes de Missions',
            subtitle: `${this.cards.demandesMission}`,
            path: '/admin/missions'
          },

          {
            id: 4,
            color: 'error',
            img: '../../assets/images/svgs/pending.png',
            title: 'Missions en Cours',
            subtitle: `${this.cards.missionsEnCour}`,
            path: '/admin/missions'
          },

          {
            id: 5,
            color: 'warning',
            img: '../../assets/images/svgs/shopping-mall.png',
            title: 'Départements',
            subtitle: `${this.cards.departement}`,
            path: '/admin/departements'
          },

          {
            id: 6,
            color: 'warning',
            img: '../../assets/images/svgs/employee.png',
            title: 'Employés',
            subtitle: `${this.cards.employes}`,
            path: '/admin/departements'
          },

        ];
      },
      error: err => {
        console.log(err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.createGeneralChart();
  }

  getStatistics(year: number): void {
    this.aulshService.getCostsByYear(year).subscribe(
      (data) => {
        this.statistics = data;
        this.updateChartData();
        this.updateGeneralChartData();
      },
      (error) => {
        console.error('Il y a eu une erreur lors de la récupération des statistiques!', error);
      }
    );
  }

  createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
          }
        }
      }
    });
  }

  createGeneralChart(): void {
    const ctx = this.generalChartCanvas.nativeElement.getContext('2d');
    this.generalChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: 'Total',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
          }
        }
      }
    });
  }

  updateChartData(): void {
    if (this.chart) {
      this.chart.data.datasets = this.statistics.map(stat => ({
        label: stat.type,
        data: [
          stat[1], stat[2], stat[3], stat[4], stat[5], stat[6],
          stat[7], stat[8], stat[9], stat[10], stat[11], stat[12]
        ],
        borderColor: this.getColorByType(stat.type), // Utiliser une couleur spécifique en fonction du type
        backgroundColor: this.getBackgroundColorByType(stat.type),
        fill: false
      }));
      this.chart.update();
    }
  }

  updateGeneralChartData(): void {
    if (this.generalChart && this.statistics.length > 0) {
      const totalData = Array(12).fill(0);
      this.statistics.forEach(stat => {
        for (let i = 1; i <= 12; i++) {
          totalData[i - 1] += Number(stat[i]) || 0;
        }
      });

      this.generalChart.data.datasets[0].data = totalData;
      this.generalChart.update();
    }
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
  }

  getColorByType(type: string): string {
    switch (type) {
      case 'VISITE_TECHNIQUE':
        return '#ADD8E6';
      case 'ASSURANCE':
        return '#90EE90';
      case 'MAINTENANCE':
        return '#FF7F7F';
      case 'REPARATION':
        return '#ff00d1';
      case 'CARBURANT':
        return '#000000';
      default:
        return this.getRandomColor(); // Revenir à une couleur aléatoire si le type est inconnu
    }
  }

  getBackgroundColorByType(type: string): string {
    switch (type) {
      case 'VISITE_TECHNIQUE':
        return 'rgba(173, 216, 230, 0.3)'; // Fond bleu avec transparence
      case 'ASSURANCE':
        return 'rgba(144, 238, 144, 0.3)'; // Fond vert avec transparence
      case 'MAINTENANCE':
        return 'rgba(255, 127, 127, 0.3)'; // Fond rouge avec transparence
      case 'REPARATION':
        return 'rgba(255, 0, 209, 0.3)'; // Fond jaune avec transparence
      case 'Carburant':
        return 'rgba(0, 0, 0, 0.3)';
      default:
        return 'rgba(0, 0, 0, 0.3)'; // Fond noir par défaut avec transparence
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

}