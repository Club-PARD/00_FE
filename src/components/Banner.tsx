import Link from "next/link";
import Image from "next/image";

// swiper 기능
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper 필수 스타일
import "swiper/css";
import "swiper/css/navigation";

import styles from "@/styles/Banner.module.css";

export default function Banner() {
  // 배너 데이터 (이미지 경로, 클릭시 이동할 주소)

  /*
    내용 매번 수정해야 되는 부분
    imgSrc => 보여줄 이미지
    link => 해당 이미지와 관련된 청원으로 이동
  */
  const banners = [
    {
      id: 1,
      imgSrc: "/banners/banner_01.jpg",
      alt: "배너",
      link: "/",
    },
    {
      id: 2,
      imgSrc: "/banners/banner_02.jpg",
      alt: "배너",
      link: "/",
    },
    {
      id: 3,
      imgSrc: "/banners/banner_03.jpg",
      alt: "배너",
      link: "/",
    },
    {
      id: 4,
      imgSrc: "/banners/banner_01.jpg",
      alt: "배너",
      link: "/",
    },
    {
      id: 5,
      imgSrc: "/banners/banner_02.jpg",
      alt: "배너",
      link: "/",
    },
    {
      id: 6,
      imgSrc: "/banners/banner_03.jpg",
      alt: "배너",
      link: "/",
    },
  ];

  return (
    <>
      <div className={styles.bannerWrapper}>
        <Swiper
          /* 화살표, 자동재생 사용 */
          modules={[Navigation, Autoplay]}
          // 슬라이드 간격
          spaceBetween={24}
          // CSS
          slidesPerView={"auto"}
          // 활성화된 슬라이드가 가운데로 오도록
          centeredSlides={true}
          // 무한 반복
          loop={true}
          // 마우스 드래그(터치)로 넘기는 기능 끄기
          allowTouchMove={false}
          // 클릭된 슬라이드를 가운데로 이동시키기
          slideToClickedSlide={true}
          // 5초마다 자동 넘김
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className={styles.swiperContainer}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} className={styles.slide}>
              {/* 클릭했을 때 이동하는 링크 */}
              <Link href={banner.link} className={styles.linkBlock}>
                <Image
                  src={banner.imgSrc}
                  alt={banner.alt}
                  fill // 부모 박스 꽉차게
                  style={{ objectFit: "cover" }} // 비율 유지하면서
                  priority // 첫 로딩 속도 향상
                  
                  
                  // 이미지 끌려나오는거 방지
                  draggable={false}
                  // 드래그 시작 이벤트 자체를 강제로 취소 (가장 확실한 방법)
                  onDragStart={(e) => e.preventDefault()}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
