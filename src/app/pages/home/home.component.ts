import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, Subscription, map, of, take } from 'rxjs';
import { PieChartsData } from 'src/app/core/models/ChartsData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  olympics$!: Observable<Olympic[]>
  pieChartsData!: PieChartsData[];
  loading: boolean = false;
  onError: boolean = false;
  subscription!: Subscription;
  errorMessage: string = "";

  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.olympics$ = this.olympicService.getOlympics();
    
    this.subscription = this.olympics$.pipe(
      map((olympics) => {
        if (olympics == null) {
          return [];
        }
        return this.getPieChartsData(olympics);
      })
    ).subscribe(
      {
        next: (data: PieChartsData[]) => {
          this.loading = false; 
          this.pieChartsData = data;
        },
        error: (error: any) => {
          this.errorMessage = error;
          this.onError = true;
          this.loading = false; 
        }
      }

    );

  }

  /**
    * Returns the total number of unique countries from a list of Olympic objects.
    * @param olympics An array of Olympic objects.
    * @returns The total number of countries.
  */
  public getTotalCountries(olympics: Olympic[]): number {
    const countryId = new Set<number>();

    olympics.forEach((olympic) => {
      countryId.add(olympic.id);
    });

    return countryId.size;
  }

  /**
    * Returns the total number of Olympic participation
    * @param olympics An array of Olympic objects
    * @returns The total number of Olympic participations.
  */
  public getTotalJOs(olympics: Olympic[]): number {
    const participationId = new Set<number>();

    const result = olympics?.reduce((total, olympic) => {
      if (olympic.participations) {
        olympic.participations.forEach((participation) => {
          if (!participationId.has(participation.id)) {
            participationId.add(participation.id);
            total++;
          }
        });
      }
      return total;
    }, 0);

    return result;
  }

  /**
   * Calculates the total number of medals per country from a list of Olympic objects.
   * @param olympics An array of Olympic objects
   * @returns List of PieChartsData objects with properties name (country name) and value (total number of medals)
   */
  public getPieChartsData(olympics: Olympic[]): PieChartsData[] {
    let result: PieChartsData[] = [];

    olympics.forEach((olympic) => {
      let data: PieChartsData = {
        id: olympic.id,
        name: olympic.country,
        value: 0
      };

      olympic.participations.forEach((participation) => {
        data.value += participation.medalsCount;
      })

      result.push(data);
    })

    return result;
  }

  public colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#956065', '#b8cbe7', '#89a1db', '#793d52', '#9780a1']
  }

  public onChartClick(event: any) {
    const countryData = this.pieChartsData.find(data => data.name == event.name);

    if (countryData) {
      let countryId: number = countryData.id;
      let url: string = `/country-detail/`;
      this.router.navigate([url, countryId]);
    }

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
