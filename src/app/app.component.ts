import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'mystoreapp';
  displayedColumns: string[] = [ 'id','productName', 'Category', 'productState','date','price','comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private api:ApiService) { }
  ngOnInit(): void {
   this.getAllProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '40%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllProducts()
      }
    })

  }

  getAllProducts(){

    this.api.getProduct().subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      }
      
    })
  }

  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width:'40%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllProducts()
      }
    })
  }


  deleteProduct(id:number){
    this.api.deleteProduct(id).subscribe({
      next:()=>{
        alert('Product Deleted')
        this.getAllProducts();
      },
      error:()=>{
        alert("Error while deleting the record")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

}
