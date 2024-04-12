import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
// import { CartService } from '../services/cart.service';
import { FoodService } from '../services/food.service';
import { Food } from '../shared/models/Food';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  foods: Food[] = [];
  constructor(private foodService: FoodService, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const searchTerm = params['searchTerm'];
      const tag = params['tag'];

      console.log('Search Term:', searchTerm);
      console.log('Tag:', tag);

      if (searchTerm) {
        this.foods = this.foodService.getAllFoodsBySearchTerm(searchTerm);
      } else if (tag) {
        this.foods = this.foodService.getAllFoodsByTag(tag);
      } else {
        this.foods = this.foodService.getAll();
      }
    });
  }
}

