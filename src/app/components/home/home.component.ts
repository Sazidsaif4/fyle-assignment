import { Component, OnInit,VERSION,
  ViewChild,ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { SubjectsService } from '../../core/services/subjects.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;

  subjectName:any=[];
  dataSource: any=[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  dataObs$!: Observable<any>;
  constructor( public subjectsService:SubjectsService,private _changeDetectorRef: ChangeDetectorRef) {
    this.bookSearch = new FormControl('');

  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
      ).
      subscribe((value: string) => {
      });
      this.trendingSubjects.forEach((element:any)=>{
        this.subjectsService.getAllBooks(element.name).subscribe((data)=>{
          this.subjectName.push(data.works);
          this.subjectName=this.subjectName.flat()
          this.setPagination(this.subjectName);
        })
        
      })
     
  }
  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs$ = this.dataSource.connect();
  }
  filter(item:any){
    if(item.target.value.length==0){
      this.dataSource = new MatTableDataSource<any>(this.subjectName);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs$ = this.dataSource.connect();
  
    }else{
      this.dataSource = new MatTableDataSource<any>(this.subjectName);
      this.dataSource.filter = item.target.value.trim();
      //this.dataSource.data=this.dataSource.data.filter((x:any)=>x.title.includes(item.target.value)|| x.authors.length!=0?x.authors[0].name.includes(item.target.value):x.authors)
      this._changeDetectorRef.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataObs$ = this.dataSource.connect();
    
    }
    
  }
}
