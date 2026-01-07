// src/lib/api/life.ts (또는 src/lib/api/manual.ts)
import axios from "./axios";

export type PetitionCreateRequest = {
  title: string;
  petitionNeeds: string;     // 청원 개요
  petitionSummary: string;
  status: number;            // 0,1,2 (진행/심사/종료)
  category: string;
  voteStartDate: string;     // "2025-11-12T15:00:00"
  voteEndDate: string;       // "2025-11-12T15:00:00"
  result: string;            // 없으면 "-"
  allows: number;            // 동의자 수
  body: string;              // 본문 (너 이미지에 0이라고 써있는데 실제로는 문자열일 가능성이 큼)
  // 서버가 type/good/bad를 고정값으로 요구한다면 여기서 넣어주면 됨
  type?: number;
  good?: number;
  bad?: number;
};

export const postPetitionNew = async (payload: PetitionCreateRequest) => {
  // 서버 요구사항: type, good, bad 0 고정이면 여기서 강제로 세팅
  const body = {
    ...payload,
    type: payload.type ?? 0,
    good: payload.good ?? 0,
    bad: payload.bad ?? 0,
    result: payload.result?.trim() ? payload.result : "-", // 비면 "-"
  };

  const res = await axios.post("/new", body);
  return res.data;
};