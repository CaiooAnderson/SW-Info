import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavesService } from '../services/naves.service';
import { Nave } from '../services/naves.interface';

@Component({
  selector: 'app-naves',
  templateUrl: './naves.component.html',
  styleUrls: ['./naves.component.scss'],
})
export class NavesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'model', 'crew'];
  dataSource = new MatTableDataSource<Nave>();
  totalDeNaves = 0;
  searchTerm = '';
  isLoading = false;

  pageSize = 5;
  pageSizeOptions = [5, 4, 3];
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private navesService: NavesService) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.carregarNaves(this.currentPage, this.pageSize);
  }

  carregarNaves(page: number, pageSize: number): void {
    this.isLoading = true;
    this.navesService.getNaves(page, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.results;
        this.totalDeNaves = response.count;
        this.isLoading = false;

        if (this.paginator) {
          this.paginator.length = this.totalDeNaves;
          this.paginator.pageIndex = page - 1;
          this.paginator.pageSize = pageSize;          
        }
      },
      error: (err) => {
        console.error('Erro ao carregar naves:', err);
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.carregarNaves(this.currentPage, this.pageSize);
  }

  onSearch(): void {
    const searchTermLower = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = searchTermLower; 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); 
    }
  }
}
