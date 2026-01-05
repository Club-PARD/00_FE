import axios from "./axios";

// 데이터 타입 정의 (서버에서 내려주는 데이터)
// 노션 명세서 기준
export interface PetitionResponse {
  id: number;
  title: string;
  type: number; // 0: 청원24, 1: 국민동의청원
  status: number; // 0,1,2 (진행, 심사, 종료)
  views: number; // 조회수

  category?: string | string[];
  
  voteStartDate: string; // 시작날짜: " 2025-11-12T15:00:00" 형태
  voteEndDate: string;   // 끝 날짜: "2025-11-12T15:00:00" 형태
  allows: number;        // 동의자 수
}

export interface PetitionPageResult {
  content: PetitionResponse[];
  
}

// [요청 타입] 서버로 보낼 조건
export interface PetitionQuery {
  type?: number;      // 0(청원24), 1(국민동의청원)
  status?: number;    // 0,1,2 (진행, 심사, 종료)
  limit?: number;     // 가져올 개수
  page?: number;      // 페이지 번호
  how?: number;       // 정렬 기준
  keyWord?: string;   // 검색어
  category?: string | string[];  // 카테고리
}

// 청원 목록 조회
export const getPetitions = async (params: PetitionQuery) => {
  try {
    
    // /petition/cardNews 로 보냄
    // params {type:1,}
    const response = await axios.get<any>("/petition/cardNews", { params });

    const data = response.data;

    // 서버 명세서 기반 (배열로 주는 경우)
    if (Array.isArray(data)) {
      return data as PetitionResponse[];
    }

    // 객체로 주는 경우 (content)
    if (Array.isArray(data?.content)) {
      return data.content as PetitionResponse[];
    }

    // 다른 키로 오는 경우
    const candidate = data?.data ?? data?.result ?? data?.items ?? data?.list;
    if (Array.isArray(candidate)) {
      return candidate as PetitionResponse[];
    }

    // 디버깅용: 예상 못한 응답 형태면 콘솔로 확인
    console.log("예상 못한 cardNews 응답 형태:", response.data);
    return [];
  } catch (error) {
    console.error("청원 목록 불러오기 실패", error);
    return [];
  }
};