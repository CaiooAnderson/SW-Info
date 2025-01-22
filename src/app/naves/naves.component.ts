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
  allNaves: Nave[] = [];
  searchTerm = '';
  isLoading = false;

  pageSize = 5;
  pageSizeOptions = [5, 4, 3];
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private navesService: NavesService) {}

  ngOnInit(): void {
    this.pageSize = 5;
    this.carregarTodasNaves();
  }

  carregarTodasNaves(): void {
    this.isLoading = true;
    this.navesService.getTodasNaves().subscribe({
      next: (response) => {
        this.allNaves = response;
        this.totalDeNaves = this.allNaves.length;
        this.atualizarTabela();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar naves:', err);
        this.isLoading = false;
      },
    });
  }

  atualizarTabela(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this.allNaves.slice(startIndex, endIndex);

    if (this.paginator) {
      this.paginator.length = this.totalDeNaves;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.pageSize = this.pageSize;
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.atualizarTabela();
  }

  onSearch(): void {
    const searchTermLower = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = searchTermLower; 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); 
    }
  }
}