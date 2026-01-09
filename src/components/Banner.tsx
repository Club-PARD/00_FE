import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "@/styles/Banner.module.css";

type BannerViewItem = {
  id: string;
  imgSrc: string;
  alt: string;
  link: string;
};

//이미지 + 연결할 청원 id
const BANNERS = [
  { imgSrc: "/banners/banner_01.svg", petitionId: "28", alt: "배너 1" },
  { imgSrc: "/banners/banner_02.svg", petitionId: "35", alt: "배너 2" },
  { imgSrc: "/banners/banner_03.svg", petitionId: "12", alt: "배너 3" },
  { imgSrc: "/banners/banner_04.svg", petitionId: "7", alt: "배너 4" },
] as const;

export default function Banner() {
  const [items, setItems] = useState<BannerViewItem[]>([]);

  useEffect(() => {
    const UNIQUE = BANNERS.length;
    const REPEAT = 2;

    const baseCount = UNIQUE;
    const mapped: BannerViewItem[] = Array.from(
      { length: baseCount * REPEAT },
      (_, idx) => {
        const baseIdx = idx % baseCount;
        const b = BANNERS[baseIdx];

        return {
          id: `${b.petitionId}-${idx}`,
          imgSrc: b.imgSrc,
          alt: b.alt,
          link: `/petition/${b.petitionId}`,
        };
      }
    );

    setItems(mapped);
  }, []);

  return (
    <div className={styles.bannerWrapper}>
      {items.length > 0 && (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={"auto"}
          centeredSlides={true}
          loop={true}
          allowTouchMove={false}
          slideToClickedSlide={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className={styles.swiperContainer}
        >
          {items.map((banner) => (
            <SwiperSlide key={banner.id} className={styles.slide}>
              <Link href={banner.link} className={styles.linkBlock}>
                <Image
                  src={banner.imgSrc}
                  alt={banner.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
