/* 카드 UI 1개 */
/* 메인페이지에서 사용하는 카드  */
/* 필요한 데이터:
  청원 제목
  청원 등록 날짜(시작한 날짜) => 가공해서 몇 일 남았는지 표시
  카테고리 => 가공해서 카테고리 별 색깔 다르게 적용
  인원 수
  링크 => 바로가기(이건 국회 안건/생활 안건에서 상세보기로 이동하는 것)
*/

import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/PetitionCard.module.css";

// 서버와 주고받을 데이터 타입
export type PetitionCardItem = {
  id: string; // 청원 id(상세 페이지 이동할 때 사용)
  title: string; // 청원 제목
  category: string; // 분야,카테고리 (배경색 매핑할 때)
  allows: number; // 동의자 수
  startDate: string; // 시작 날짜(등록/게시 시작일) "YYYY-MM-DD"
  endDate: string; // 끝 날짜(마감일) "YYYY-MM-DD"

  // 나중에 사용할 수도 있는 정보
  status?: 0 | 1 | 2; // 0 진행 / 1 심사 / 2 종료
  type?: string; // 청원24 / 국민동의청원
};

// 카테고리 -> 카드 배경색과 매핑 (서버에서 category 문자열을 key로 사용)
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  "정치, 선거, 국회운영": { bg: "#e7f0ff", text: "#6990CF" },
  "수사, 법무, 사법제도": { bg: "#e7f0ff", text: "#6990CF" },
  "재정, 세제, 금융, 예산": { bg: "#e7f0ff", text: "#6990CF" },
  "소비자, 공정거래": { bg: "#fff4e6", text: "#daa25b" }, 
  "교육" : { bg: "#efe7ff", text: "#9071cd" },
  "과학기술, 정보통신": { bg: "#efe7ff", text: "#9071cd" },
  "외교, 통일, 국방, 안보": { bg: "#efe7ff", text: "#9071cd" },
  "재난, 안전, 환경": { bg: "#fff9e8", text: "#cda430" },
  "행정, 지방자치": { bg: "#f8ffe8", text: "#79B495" },
  "문화, 체육, 관광, 언론": { bg: "#fff9e8", text: "#cda430" },
  "농업, 임업, 수산업, 축산업": { bg: "#fff4e6", text: "#daa25b" },
  "산업, 통상": { bg: "#f8ffe8", text: "#79B495" },
  "보건의료" : { bg: "#ffe8ee", text: "#c77288" },
  "복지, 보훈": { bg: "#ffe8ee", text: "#c77288" },
  "국토, 해양, 교통": { bg: "#f8ffe8", text: "#79B495" },
  "인권, 성평등, 노동": { bg: "#ffe8ee", text: "#c77288" },
  "저출산, 고령화, 아동, 청소년, 가족": { bg: "#ffe8ee", text: "#c77288" },
  "기타": { bg: "#f1f1f1", text: "#767676" },
  
};

// ???????????
// 숫자 포맷 함수 - 한국 지역 기준 100,000 처럼 쉼표 찍어줄 때 사용
function formatNumber(n: number) {
  return n.toLocaleString("ko-KR");
}

// ???????????
// D-Day 계산
/* endDate - 오늘 날짜 */
function calcDday(endDate: string) {
  const end = new Date(endDate + "T00:00:00");
  const today = new Date();

  // 날짜 기준으로 계산 => 00:00:00으로 통일 시켜서
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = end.getTime() - today.getTime(); // 밀리초 차이
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // 하루를 ms 단위로 바꾸고

  return diffDays;
}

// ???????????
// Props 타입
// 컴포넌트에 전달되는 값
type PetitionCardProps = {
  item: PetitionCardItem;

  href?: string;

  forceCategoryGray?: boolean; // 생활안건 강제 회색
};

export default function PetitionCard({ item, href, forceCategoryGray  }: PetitionCardProps) {
  // 카테고리 정규화
  const categoryKey = (item.category ?? "").trim().replace(/\//g, ", ");

  // 카테고리 배경색
  const categoryStyle = forceCategoryGray
  ? { bg: "#f1f1f1", text: "#767676" }
  : (CATEGORY_STYLES[categoryKey] ?? { bg: "#f1f1f1", text: "#767676" });

  // 정규식으로 , -> ·으로 바꾸기
  const formattedCategory = (item.category ?? "")
    .replace(/\//g, " · ")
    .replace(/,\s*/g, " · ");

  // D-day 계산
  const dday = calcDday(item.endDate);

  // D-day 빨간색 되는 경우
  const isUrgent = dday >= 0 && dday <= 7;

  // 빨간색 아니면 회색으로
  const badgeColorClass = isUrgent ? styles.ddayRed : styles.ddayGray;

  // 바로가기 버튼에 들어갈 주소(id)
  const detailHref = href ?? `/petitions/${item.id}`;

  return (
    <>
      {/* 바깥 쪽 전체 카드 컨테이너 */}
      <article className={styles.cardWrapper}>
        {/* 안 쪽 내용 영역 */}
        <div className={styles.whiteCard}>
          {/* 상단 줄: D-day 북마크 부분 */}
          <div className={styles.headerRow}>
            <span className={`${styles.ddayBadge} ${badgeColorClass}`}>
              {dday >= 0 ? `D-${dday}` : `마감`}
            </span>

            {/* 북마크 */}
            <button
              className={styles.bookmarkBtn}
              type="button"
              aria-label="북마크"
            >
              {/* 북마크 누름 여부에 따라 색칠 되어야 함 */}
              <Image src="/bookMark.svg" alt="" width={24} height={24} />
            </button>
          </div>

          {/* 날짜: 시작 날짜 표시 */}
          <div className={styles.date}>{item.startDate}</div>

          {/* 제목 */}
          <h3 className={styles.title}>{item.title}</h3>

          {/* 카테고리(분야) */}
          <div
            className={styles.categoryBadge}
            style={{
            backgroundColor: categoryStyle.bg, // 지정된 배경색
            color: categoryStyle.text,         // 지정된 글자색
          }}
          >
            {formattedCategory}
          </div>
        </div>

        {/* 하단줄: (보라색 영역)*/}
        <Link href={detailHref} className={styles.bottomLink}>
          {/* 왼쪽: 동의자 수 */}
          <div className={styles.countArea}>
            <div className={styles.countIcon}>
              <Image
                src="/agree_purple.svg"
                alt="동의"
                width={24}
                height={24}
              />
            </div>

            <span className={styles.countText}>
              {formatNumber(item.allows)}명
            </span>
          </div>

          {/* 오른쪽: 화살표 */}
          <div className={styles.arrowIcon}>
            <Image
              src="/right_arrow_white.svg"
              alt="이동"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </article>
    </>
  );
}
