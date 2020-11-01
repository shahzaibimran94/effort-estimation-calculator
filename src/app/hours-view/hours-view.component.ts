import { 
  Component, 
  OnInit, 
  Input, 
  SimpleChanges,
  ViewChild, 
  Renderer2, 
  ElementRef, 
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-hours-view',
  templateUrl: './hours-view.component.html',
  styleUrls: ['./hours-view.component.css']
})
export class HoursViewComponent implements OnInit {
  @Input() devHours;
  @Input() nonDevHours;
  @ViewChild('avgOut') avg_out: ElementRef;
  @ViewChild('avgIn') avg_in: ElementRef;
  @Output() toggle = new EventEmitter<any>();
  avgTotalPrev = 0;
  avgTotalCurr = 0;
  animationDir = false;
  constructor(private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
    // const { devHours, nonDevHours } = changes;
    // if (devHours.previousValue) {
    //   this.avgTotalCurr = +(devHours.currentValue + nonDevHours.currentValue).toFixed(1);
    //   this.avgTotalPrev = +(devHours.previousValue + nonDevHours.previousValue).toFixed(1);
    //   this.animationDir = !this.animationDir;
    //   if (this.animationDir) {
    //     this.renderer.setStyle(this.avg_in.nativeElement, 'transform', `translateY(100%)`);
    //     this.renderer.setStyle(this.avg_out.nativeElement, 'transform', `translateY(-100%)`);
    //     setTimeout(()=>{
    //       this.renderer.setStyle(this.avg_in.nativeElement, 'transform', `translateY(0)`);
    //     }, 100);
    //   } else {
    //     this.renderer.setStyle(this.avg_in.nativeElement, 'transform', `translateY(-100%)`);
    //     this.renderer.setStyle(this.avg_out.nativeElement, 'transform', `translateY(0)`);
    //     setTimeout(()=>{
    //       this.renderer.setStyle(this.avg_out.nativeElement, 'transform', `translateY(-100%)`);
    //       this.renderer.setStyle(this.avg_in.nativeElement, 'transform', `translateY(0)`);
    //     }, 100);
    //   }
    // }
  }

  ngOnInit() {
  }

}
