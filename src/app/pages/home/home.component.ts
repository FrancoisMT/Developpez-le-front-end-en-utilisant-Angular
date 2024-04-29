import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, map, of } from 'rxjs';
import { PieChartsData } from 'src/app/core/models/ChartsData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public olympics$: Observable<Olympic[] | null> = of(null);
  public pieChartsData !: PieChartsData[];

  constructor(private olympicService: OlympicService) { }

  ngOnInit(): void {

    this.olympics$ = this.olympicService.getOlympics();

    if (this.olympics$) {
      this.olympics$.pipe(
        map((olympics) => {
          if (olympics == null) {
            return [];
          }
          return this.getPieChartsData(olympics);
        })
      ).subscribe((data) => {
        this.pieChartsData = data;
      });
    }

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
        id : olympic.id,
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
    console.log(event);
  }


}
