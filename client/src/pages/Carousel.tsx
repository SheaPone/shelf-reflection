import { useState, useEffect } from 'react';
import { GoDot, GoDotFill } from 'react-icons/go';
import { Image } from './Images';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

type Props = {
  images: Image[];
};

export function Carousel({ images }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [images.length]);

  function nextClick(): void {
    const currentIndex = index;
    setIndex((currentIndex + 1) % images.length);
  }

  function prevClick(): void {
    const currentIndex = index;
    setIndex((currentIndex - 1 + images.length) % images.length);
  }

  function handleDotClick(dotIndex: number): void {
    setIndex(dotIndex);
  }

  return (
    <div className="carousel-container">
      <div className="carousel-content">
        <PrevArrow onClick={prevClick} />
        <ImageCard image={images[index]} />
        <NextArrow onClick={nextClick} />
      </div>
      <Dots onDotClick={handleDotClick} current={index} count={images.length} />
    </div>
  );
}

type dotProps = {
  count: number;
  current: number;
  onDotClick: (index: number) => void;
};

function Dots({ count, current, onDotClick }: dotProps) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(
      i === current ? (
        <GoDotFill key={i} onClick={() => onDotClick(i)} />
      ) : (
        <GoDot key={i} onClick={() => onDotClick(i)} />
      )
    );
  }
  return <div className="dots-container">{dots}</div>;
}

type imageProps = {
  image: Image;
};

export function ImageCard({ image }: imageProps) {
  return (
    <>
      <img src={image.src} alt={image.alt} className="image-card" />
    </>
  );
}

type backProps = {
  onClick: () => void;
};

export function PrevArrow({ onClick }: backProps) {
  return (
    <>
      <IoIosArrowBack
        size={40}
        onClick={onClick}
        className="arrow float-left"
      />
    </>
  );
}

type forwardProps = {
  onClick: () => void;
};

export function NextArrow({ onClick }: forwardProps) {
  return (
    <>
      <IoIosArrowForward
        size={40}
        onClick={onClick}
        className="arrow forward"
      />
    </>
  );
}
