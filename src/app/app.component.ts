import { Component } from '@angular/core';
import { Data } from './model/interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  constructor(private _http: HttpClient) {};

  public searchData: any | null = '';
  public searchDataFilter: string = '';
  public filteredData: Array<Data | any> = [];
  public data: Array<any> = [];
  public headlines: Array<string> = [ 'WO ID','Description','Received date','Assigned to','Status','Priority' ];

  public loadData() {
    this._http.get('http://localhost:3000/data').subscribe((response: any) => {
    this.data = response;
    });
    this._transform();
  };

  public filter(searchData: string) {
    if (!searchData) {
      alert('Please enter description to search');
    } else {
      this.searchDataFilter = searchData;
      this._transform();
    };
    this.searchData = '';
  };

  public clearFilter() {
    this.searchDataFilter = '';
    this._transform();
  };

  private _transform = () => {
    this.filteredData = [];
    let fetchedData = this.data;

      if(this.searchDataFilter){
        fetchedData = fetchedData.filter((e) =>
          e.description.toLowerCase().includes(this.searchDataFilter?.toLowerCase()));
      };

      fetchedData.forEach((e: any) => {
      let assignedArray: any = [];
      let assigned = () => {
        e.assigned_to.forEach((e: any) => {
          let person_name = !e.person_name ? '' : e.person_name;
          let status = !e.status ? '' : e.status;
          return assignedArray.push(' person_name: ' + person_name + ', status: ' + status);
        });
        return assignedArray;
      };

      let dataElements = {
        'WO ID': e.work_order_id,
        'Description': e.description,
        'Received date': e.received_date,
        'Status': e.status,
        'Priority': e.priority,
        'Assigned to': assigned(),
      };
      this.filteredData.push(dataElements);
    });
  };
}