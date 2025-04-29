import { Carousel } from './Carousel';
import { Catalog } from './Catalog';
import { images } from './Images';
import { useUser } from '../components/useUser';

export function Shop() {
  const { user } = useUser();
  return (
    <>
      <h2 className="margin-top-2">Top Five Books of 2025</h2>
      <Carousel images={images} />
      {user && <Catalog />}
    </>
  );
}
