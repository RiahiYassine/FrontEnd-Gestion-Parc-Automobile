import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AulshService } from '../services/aulsh.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';

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


  chart!: Chart;
  generalChart!: Chart;
  displayedColumns: string[] = ['type', 'year', 
    'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 
    'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 
    'total'
  ];

  operationTypes: string[] = ['ASSURANCE', 'VISITE_TECHNIQUE', 'MAINTENANCE', 'REPARATION'];

  constructor(private aulshService: AulshService) { }

  onSubmit(): void {
    this.getStatisticsByType(this.year); // Fetch statistics based on the selected year and operation type
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
        console.error('There was an error fetching the statistics!', error);
      }
    );
  }


  ngOnInit(): void {
    this.getStatistics(this.year);
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
        console.error('There was an error fetching the statistics!', error);
      }
    );
  }

  createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        borderColor: this.getColorByType(stat.type), // Use specific color based on type
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
          totalData[i-1] += Number(stat[i]) || 0;
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
      default:
        return this.getRandomColor(); // Fallback to a random color if type is unknown
    }
  }
  
  getBackgroundColorByType(type: string): string {
    switch (type) {
      case 'VISITE_TECHNIQUE':
        return 'rgba(173, 216, 230, 0.3)'; // Blue background with transparency
      case 'ASSURANCE':
        return 'rgba(144, 238, 144, 0.3)'; // Green background with transparency
      case 'MAINTENANCE':
        return 'rgba(255, 127, 127, 0.3)'; // Red background with transparency
      case 'REPARATION':
        return 'rgba(255, 0, 209, 0.3)'; // Yellow background with transparency
      default:
        return 'rgba(0, 0, 0, 0.3)'; // Default to black background with transparency
    }
  }



}