import { 
  Component, 
  OnInit, 
  Output, 
  EventEmitter, 
  Input 
} from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-select-app',
  templateUrl: './select-app.component.html',
  styleUrls: ['./select-app.component.css']
})
export class SelectAppComponent implements OnInit {
  @Output() clearAppType = new EventEmitter<string>();
  @Output() hasSelected = new EventEmitter<string>();
  @Input() appTiles;
  
  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.mainService.resetCalc();
  }

  selectedTile(tile_name: string): void {
    this.mainService.appName = tile_name;
    this.hasSelected.emit('');
  }

}
