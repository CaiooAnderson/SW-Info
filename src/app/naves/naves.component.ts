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
        'A-wing': '../../assets/starships/A-wing.svg',
        'AA-9 Coruscant freighter': '../../assets/starships/AA-9_Coruscant_freighter.svg',
        'arc-170': '../../assets/starships/arc-170.svg',
        'B-wing': '../../assets/starships/B-wing.svg',
        'Banking clan frigte': '../../assets/starships/Banking_clan_frigte.svg',
        'Belbullab-22 starfighter': '../../assets/starships/Belbullab-22_starfighter.svg',
        'Calamari Cruiser': '../../assets/starships/Calamari_Cruiser.svg',
        'CR90 corvette': '../../assets/starships/CR90_corvette.svg',
        'Death Star': '../../assets/starships/Death_Star.svg',
        'Droid control ship': '../../assets/starships/Droid_control_ship.svg',
        'EF76 Nebulon-B escort frigate': '../../assets/starships/EF76_Nebulon-B_escort_frigate.svg',
        'Executor': '../../assets/starships/Executor.svg',
        'H-type Nubian yacht': '../../assets/starships/H-type_Nubian_yacht.svg',
        'Imperial shuttle': '../../assets/starships/Imperial_shuttle.svg',
        'J-type diplomatic barge': '../../assets/starships/J-type_diplomatic_barge.svg',
        'Jedi Interceptor': '../../assets/starships/Jedi_Interceptor.svg',
        'Jedi starfighter': '../../assets/starships/Jedi_starfighter.svg',
        'Millennium Falcon': '../../assets/starships/Millennium_Falcon.svg',
        'Naboo fighter': '../../assets/starships/Naboo_fighter.svg',
        'Naboo Royal Starship': '../../assets/starships/Naboo_Royal_Starship.svg',
        'Naboo star skiff': '../../assets/starships/Naboo_star_skiff.svg',
        'Rebel transport': '../../assets/starships/Rebel_transport.svg',
        'Republic Assault ship': '../../assets/starships/Republic_Assault_ship.svg',
        'Republic attack cruiser': '../../assets/starships/Republic_attack_cruiser.svg',
        'Republic Cruiser': '../../assets/starships/Republic_Cruiser.svg',
        'Scimitar': '../../assets/starships/Scimitar.svg',
        'Sentinel-class landing craft': '../../assets/starships/Sentinel-class_landing_craft.svg',
        'Slave 1': '../../assets/starships/Slave_1.svg',
        'Solar Sailer': '../../assets/starships/Solar_Sailer.svg',
        'Star Destroyer': '../../assets/starships/Star_Destroyer.svg',
        'Theta-class T-2c shuttle': '../../assets/starships/Theta-class_T-2c_shuttle.svg',
        'TIE Advanced x1': '../../assets/starships/TIE_Advanced_x1.svg',
        'Trade Federation cruiser': '../../assets/starships/Trade_Federation_cruiser.svg',
        'V-wing': '../../assets/starships/V-wing.svg',
        'X-wing': '../../assets/starships/X-wing.svg',
        'Y-wing': '../../assets/starships/Y-wing.svg'
      };
  
      return naveImages[this.selectedNave.name] || '../../assets/starships/default-nave.jpg';
    }
  
    return '../../assets/starships/default-nave.jpg';
  }
}