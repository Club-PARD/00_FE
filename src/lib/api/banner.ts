import axios from "./axios";

// 타입
export type CardNewsItem = {
  id: number | string;
  title: string;
  type: 0 | 1; // 0=청원24, 1=국민동의청원
  status: 0 | 1 | 2;
  category: string;
  subTitile?: string;
  voteStartDate?: string;
  voteEndDate?: string;
  allows: number;
};

// 카드뉴스 가져오기 (배너로 쓸 거)
export const getCardNews = async (params?: {
  type?: 0 | 1;
  status?: 0 | 1 | 2;
  limit?: number;
  page?: number;
  how?: 0 | 1;
  keyWord?: string;
  category?: string;
}) => {
  try {
    const res = await axios.get<any>("/petition/cardNews", { params });
    const data = res.data;

    if (Array.isArray(data)) return data as CardNewsItem[];
    if (Array.isArray(data?.content)) return data.content as CardNewsItem[];

    const candidate = data?.data ?? data?.result ?? data?.items ?? data?.list;
    if (Array.isArray(candidate)) return candidate as CardNewsItem[];

    console.log("예상 못한 cardNews 응답 형태:", data);
    return [];
  } catch (e) {
    console.error("카드뉴스 불러오기 실패", e);
    return [];
  }
};