import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomSpinnerComponent } from './pages/common/custom-spinner/custom-spinner.component';
import { ErrorBannerComponent } from './pages/common/error-banner/error-banner.component';


@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CountryDetailComponent, CustomSpinnerComponent, ErrorBannerComponent],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    AppRoutingModule, 
    HttpClientModule, 
    NgxChartsModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
