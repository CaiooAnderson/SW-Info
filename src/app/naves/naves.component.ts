import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
  searchTerm = '';
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private navesService: NavesService) {}

  ngOnInit(): void {
    this.carregarNaves();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Atribui o paginator ao dataSource
  }

  carregarNaves(): void {
    this.isLoading = true;
    this.navesService.getNaves().subscribe({
      next: (response) => {
        this.dataSource.data = response.results; // Atualiza a dataSource com as naves recebidas
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar naves:', err);
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    const searchTermLower = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = searchTermLower; // Aplica o filtro diretamente no dataSource

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reseta para a primeira página após a busca
    }
  }
}
