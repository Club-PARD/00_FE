// 생활안건(청원24) 전용 API
import axios from "./axios";
import type { PetitionResponse, PetitionQuery } from "./mainCard";

// 생활안건(청원24)만 가져오는 함수
export const getLifePetitions = async (
  params: Omit<PetitionQuery, "type">
) => {
  try {
    const response = await axios.get<any>("/petition/cardNews", {
      params: { ...params, type: 0 }, // type = 0, 생활 안건
    });

    const data = response.data;

    if (Array.isArray(data)) return data as PetitionResponse[];
    if (Array.isArray((data as any)?.content)) return (data as any).content as PetitionResponse[];

    const candidate = (data as any)?.data ?? (data as any)?.result ?? (data as any)?.items ?? (data as any)?.list;
    if (Array.isArray(candidate)) return candidate as PetitionResponse[];

    console.log("예상 못한 life 응답 형태:", data);
    return [];
  } catch (error) {
    console.error("생활안건 목록 불러오기 실패", error);
    return [];
  }
};
