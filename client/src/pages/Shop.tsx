import { Carousel } from './Carousel';
import { Catalog } from './Catalog';
import { images } from './Images';

export function Shop() {
  return (
    <>
      <h2>Top Five Books of 2025</h2>
      <Carousel images={images} />
      <Catalog />
    </>
  );
}
