import Slider from "react-slick";
import { StatisticDTO } from "../types/novel.types";
import { TopViewedSlideItem } from "./TopViewedSlideItem";

// Custom arrow component
const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-ocean-blue-500 !rounded-full !w-12 !h-12 hover:!bg-ocean-blue-600`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-ocean-blue-500 !rounded-full !w-12 !h-12 hover:!bg-ocean-blue-600`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};

interface TopViewedSliderProps {
  novels: StatisticDTO[];
}

export const TopViewedSlider = ({ novels }: TopViewedSliderProps) => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
    ],
  };

  if (!novels || novels.length === 0) {
    return <p className="text-gray-500">No top viewed novels available</p>;
  }

  return (
    <div className="w-full bg-gradient-to-r from-ocean-blue-700 to-deep-space-blue-800 py-10 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        Top Viewed Novels
      </h2>
      <div className="px-6">
        <Slider {...settings}>
          {novels.map((novel) => (
            <div key={novel.novelId} className="px-3">
              <TopViewedSlideItem novel={novel} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};