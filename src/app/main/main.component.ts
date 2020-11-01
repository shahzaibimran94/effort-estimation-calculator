import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title = 'cleveroad-calc';
  appType: string;
  appTiles: Array<Object>;
  allTiles = [
    { app: 'existing', img: 'https://cleveroad.com/images/article-previews/icon-app-uber.png', name: 'Uber' },
    { app: 'business', img: 'https://cleveroad.com/images/article-previews/icon-cat-shopping.png', name: 'Shopping' }
  ];
  hasSelected: boolean;
  hasCompleted: boolean;
  
  constructor(private mainService: MainService) {}

  ngOnInit(): void {}

  getSelected(option_selected: string): void {
    this.mainService.appType = option_selected;
    this.appType = option_selected;
    this.appTiles = this.allTiles.filter(at => at.app === option_selected);
  }

}
