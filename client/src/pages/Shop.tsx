import { Carousel } from './Carousel';
import { Catalog } from './Catalog';
import { images } from './Images';

export function Shop() {
  return (
    <>
      <Carousel images={images} />
      <Catalog />
    </>
  );
}
