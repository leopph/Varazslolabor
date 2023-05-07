import { Component } from '@angular/core';
import { ProductManagerService } from '../services/product-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private productManager: ProductManagerService) {}

  products: Array<{name: string, packaged: boolean, rarity: Number, price: Number, quantity: Number, unit: String}> = []

  ngOnInit() {
    this.productManager.getProducts().subscribe((products: any) => {
      this.products = products;
    });
  }
}
