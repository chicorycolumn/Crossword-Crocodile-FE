import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[wiggly]',
  host: {
    '(input)': 'update($event)',
  },
})
export class WigglyDirective implements OnInit {
  @Input() myProperty;
  @Output() myPropertyChange: EventEmitter<any> = new EventEmitter();
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  update(event) {
    this.myPropertyChange.emit(this.el.nativeElement.innerText);
  }
  ngOnInit() {
    this.el.nativeElement.innerText = this.myProperty;
  }
}

// @Directive({
//   selector: '[wiggly]',
// })
// export class WigglyDirective {
//   constructor(elementRef: ElementRef, renderer: Renderer2) {
//     renderer.setStyle(elementRef.nativeElement, 'backgroundColor', '#fff');
//   }
//   // @Input() func: any;

//   // @Output() someEvent: EventEmitter<any> = new EventEmitter();

//   @HostListener('mousewheel') onMouseWheel($event) {
//     console.log('you scrolled');
//     this.func();

//     // console.log(this.thing);
//     // this.thing++;
//     // console.log(this.thing);

//     // this.someEvent.emit(this.thing);

//     // let ref = {
//     //   // deltaX: event.deltaX,
//     //   // deltaY: event.deltaY,
//     //   // deltaZ: event.deltaZ,
//     //   // deltaMode: event.deltaMode,
//     //   // wheelDeltaX: event.wheelDeltaX,
//     //   // wheelDeltaY: event.wheelDeltaY,
//     //   wheelDelta: event.wheelDelta,
//     // };
//     // for (let i = 0; i < Object.keys(ref).length; i++) {
//     //   console.log(Object.keys(ref)[i], ref[Object.keys(ref)[i]]);
//     // }
//     // this.thing();
//     // console.log('***********');
//   }
// }
