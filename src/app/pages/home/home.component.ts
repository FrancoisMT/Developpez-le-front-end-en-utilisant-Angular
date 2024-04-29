import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  public olympics$: Observable<Olympic[] | null> = of(null);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }


  getNumberOfJOs(olympics: Olympic[] | null) : number {

    if (!olympics) {
      return 0; 
    }

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



  

}
