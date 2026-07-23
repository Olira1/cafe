import bbqBurger from '../asset/image/BBQ Burger.avif';
import cheesecake from '../asset/image/Cheesecake.avif';
import chickenAlfredo from '../asset/image/Chicken Alfredo.avif';
import chocolateLavaCake from '../asset/image/Chocolate Lava Cake.avif';
import classicBurger from '../asset/image/Classic Burger.avif';
import craftBeer from '../asset/image/Craft Beer.avif';
import garlicBread from '../asset/image/Garlic Bread.jpg';
import grilledSalmon from '../asset/image/Grilled Salmon.avif';
import icedTea from '../asset/image/Iced Tea.avif';
import lemonade from '../asset/image/Lemonade.avif';
import margheritaPizza from '../asset/image/Margherita Pizza.avif';
import pepperoniPizza from '../asset/image/Pepperoni Pizza.avif';
import ribeyeSteak from '../asset/image/Ribeye Steak.avif';
import caesarSalad from '../asset/image/salad.avif';
import sparklingWater from '../asset/image/Sparkling Water.avif';
import springRolls from '../asset/image/Spring Rolls.jpg';
import tiramisu from '../asset/image/Tiramisu.avif';
import veggiePasta from '../asset/image/Veggie Pasta.avif';

const MENU_IMAGES: Record<string, string> = {
  'BBQ Burger': bbqBurger,
  Cheesecake: cheesecake,
  'Chicken Alfredo': chickenAlfredo,
  'Chocolate Lava Cake': chocolateLavaCake,
  'Classic Burger': classicBurger,
  'Craft Beer': craftBeer,
  'Garlic Bread': garlicBread,
  'Grilled Salmon': grilledSalmon,
  'Iced Tea': icedTea,
  Lemonade: lemonade,
  'Margherita Pizza': margheritaPizza,
  'Pepperoni Pizza': pepperoniPizza,
  'Ribeye Steak': ribeyeSteak,
  'Caesar Salad': caesarSalad,
  'Sparkling Water': sparklingWater,
  'Spring Rolls': springRolls,
  Tiramisu: tiramisu,
  'Veggie Pasta': veggiePasta,
};

export function getMenuItemImage(item: { name?: string; image?: string }): string {
  return item.image || MENU_IMAGES[item.name || ''] || '';
}
