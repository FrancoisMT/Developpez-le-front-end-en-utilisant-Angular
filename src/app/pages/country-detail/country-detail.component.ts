import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LineChartDataSeries, LineChartsData } from 'src/app/core/models/ChartsData';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  id !: number | null;
  olympic !: Olympic | null;
  countryName !: string;
  totalParticipations !: number;
  totalAthletes !: number;
  totalMedals !: number;
  lineChartsData: LineChartsData[] = [];
  loading: boolean = false;

  constructor(
    private service: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let paramId = this.route.snapshot.paramMap.get('id');
    this.id = paramId ? +paramId : null;

    if (this.id) {
      this.getOlympicData();
    }

  }

  /**
   * Retrieve olympic data associated with the id in url
   */
  public getOlympicData() {

    this.service.getOlympics().subscribe((olympics) => {
      if (olympics) {
        this.olympic = olympics.find(olympic => olympic.id == this.id) || null;
        if (this.olympic) {
          this.countryName = this.olympic.country;
          this.setTotalValues(this.olympic);
          this.lineChartsData = [this.getLineChartData(this.olympic)];
        }
      }
    });

  }

  public setTotalValues(olympic: Olympic) {
    let participations = new Set<number>();
    let totalMedals = 0;
    let totalAthletes = 0;

    if (olympic.participations) {
      olympic.participations.forEach((participation) => {
        if (!participations.has(participation.id)) {
          participations.add(participation.id);
          totalMedals += participation.medalsCount;
          totalAthletes += participation.athleteCount;
        }
      })
    }

    this.totalParticipations = participations.size;
    this.totalMedals = totalMedals;
    this.totalAthletes = totalAthletes;
  }


  public getLineChartData(olympic: Olympic): LineChartsData {
    let result = new LineChartsData();
    result.name = "";
    result.series = [];
    result.name = olympic.country;

    olympic.participations.forEach((participation) => {
      let serie = new LineChartDataSeries();

      serie.name = (participation.year).toString();
      serie.value = participation.medalsCount;

      result.series.push(serie);
    })

    return result;
  }


  public backToDashboard() {
    this.router.navigateByUrl("/");
  }

}