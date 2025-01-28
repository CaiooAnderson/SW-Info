import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavesService } from '../services/naves.service';
import { Nave } from '../services/naves.interface';

@Component({
  selector: 'app-naves',
  templateUrl: './naves.component.html',
  styleUrls: ['./naves.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'model', 'crew'];
  dataSource = new MatTableDataSource<Nave>();
  totalDeNaves = 0;
  allNaves: Nave[] = [];
  searchTerm = '';
  isLoading = false;
  selectedNave: Nave | null = null;

  pageSize = 4;
  pageSizeOptions = [5, 4, 3];
  currentPage = 0;

  noResultsFound = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private navesService: NavesService) {}

  ngOnInit(): void {
    this.pageSize = 4;
    this.carregarTodasNaves();

    this.dataSource.filterPredicate = (data: Nave, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }

  carregarTodasNaves(): void {
    this.isLoading = true;
    this.navesService.getTodasNaves().subscribe({
      next: (response) => {
        this.allNaves = response;
        this.totalDeNaves = this.allNaves.length;
        this.atualizarTabela();
        this.isLoading = false;
        this.noResultsFound = this.totalDeNaves === 0;
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
  
    const dataToDisplay = this.searchTerm
      ? this.allNaves.filter(nave =>
          nave.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
        )
      : this.allNaves;
  
    this.dataSource.data = dataToDisplay.slice(startIndex, endIndex);
  
    if (this.paginator) {
      this.paginator.length = dataToDisplay.length;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.pageSize = this.pageSize;
    }

    this.noResultsFound = dataToDisplay.length === 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.atualizarTabela();
  }

  onSearch(): void {
    this.isLoading = true;
    this.selectedNave = null;
  
    setTimeout(() => {
      const searchTermLower = this.searchTerm.trim().toLowerCase();
      
      let filteredNaves = this.allNaves;
      
      if (searchTermLower) {
        filteredNaves = this.allNaves.filter(nave =>
          nave.name.toLowerCase().includes(searchTermLower)
        );
      }

      this.totalDeNaves = filteredNaves.length;
      this.noResultsFound = this.totalDeNaves === 0;

      this.currentPage = 0;
      this.dataSource.data = filteredNaves.slice(0, this.pageSize);
      this.isLoading = false;
    }, 500);
  }

  reloadNaves(): void {
    this.searchTerm = '';
    this.carregarTodasNaves();
  }

  onRowClick(nave: Nave): void {
    this.selectedNave = this.selectedNave === nave ? null : nave;
    console.log('Nave selecionada:', this.selectedNave);
  }

  getNaveImage(): string {
    if (this.selectedNave) {
      const naveImages: { [key: string]: string } = {
        'CR90 Corvette': '../../assets/CR90_Corvette.jpg',
        'Star Destroyer': '../../assets/Star_Destroyer.jpg',
        'Sentinel-class landing craft': '../../assets/Sentinel-class_landing_craft.jpg',
        'Death Star': '../../assets/Death_Star.jpg',
        'Millenium Falcon': '../../assets/Millenium_Falcon.jpg',
      };
  
      return naveImages[this.selectedNave.name] || '../../assets/default-nave.jpg';
    }
  
    return '../../assets/default-nave.jpg';
  }
}