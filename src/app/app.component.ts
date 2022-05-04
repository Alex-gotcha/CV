import { Component, ElementRef, ViewChild } from '@angular/core';

interface Point {
  x: number,
  y: number,
}

function rnd(min, max) {
  let rand = min + Math.random() * (max - min);
  return Math.floor(rand);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('canvas') elementCanvas: ElementRef<HTMLCanvasElement>;

  public items: Point[] = this.genRandom();

  private genRandom() {
    const points: Point[] = [];

    for (let i = 0; i < 100; i++) {
      points.push({ x: -rnd(100, 1000), y: rnd(100, 1000) });
    }

    for (let i = 0; i < 10; i++) {
      points.push({ x: rnd(10, 100), y: rnd(10, 1000) });
    }

    return points;
  }

  // https://stackoverflow.com/a/58670799
  private getCentroid(points: Point[]) {
    let centroid = { x: 0, y: 0 }
    for (let i = 0; i < points.length; i++) {
      centroid.x += points[i].x
      centroid.y += points[i].y
    }

    centroid.x /= points.length
    centroid.y /= points.length
    return centroid
  }

  private sortNonIntersecting(points: Point[]) {
    const center = this.getCentroid(points)
    return points.slice().sort((a: Point, b: Point) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x)
      const angleB = Math.atan2(b.y - center.y, b.x - center.x)
      return angleA - angleB
    })
  }

  public draw() {
    const { nativeElement: canvas } = this.elementCanvas;
    canvas.style.display = 'block';

    // TODO: better code? U'r waste my time
    const minX = this.items.reduce((acc, item) => Math.min(acc, item.x), 0);
    const maxX = this.items.reduce((acc, item) => Math.max(acc, item.x), 0);
    const minY = this.items.reduce((acc, item) => Math.min(acc, item.y), 0);
    const maxY = this.items.reduce((acc, item) => Math.max(acc, item.y), 0);

    canvas.width = maxX - minX + 20;
    canvas.height = maxY - minY + 20;

    const offsetX = minX < 0 ? -minX : 0;
    const offsetY = minY < 0 ? -minY : 0;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'red';
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill()

    ctx.fillStyle = 'black';


    const sorted = this.sortNonIntersecting(this.items);

    sorted.forEach((item, index) => {
      if (index) {
        ctx.lineTo(offsetX + item.x, offsetY + item.y);
      } else {
        ctx.moveTo(offsetX + item.x, offsetY + item.y);
      }
    });

    ctx.stroke();
  }
}
