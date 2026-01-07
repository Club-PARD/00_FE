import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import type { ReactNode } from "react";

import Header from "@/components/Header";
import styles from "@/styles/MypageTest.module.css";

/* 유형 */
type ChoiceType = "A" | "B" | "C" | "D";

type Option = {
  text: string;
  type: ChoiceType; // A/B/C/D 매핑
};

type Question = {
  id: number;
  title: string;
  options: Option[];
  highlight?: string[];
};

// !!!!!!!!!!!!!!!!!!! 내용 추가하기  !!!!!!!!!!!!!!!!!!!
const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    highlight: ["새로운 정책", "첫 반응"],
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 2,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 3,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 4,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 5,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 6,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 7,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 8,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
  {
    id: 9,
    title: "새로운 정책이 제안되었을 때, 당신의 첫 반응은?",
    options: [
      { text: "지금이 아니면 이런 시도도 못 해볼 것 같다", type: "A" },
      { text: "괜히 건드려서 더 복잡해지는 건 아닐까", type: "B" },
      { text: "그래서 내 상황에서 뭐가 달라지는지 궁금하다", type: "C" },
      {
        text: "이 정책이 사회적으로 어떤 의미를 가지는지 생각해본다",
        type: "D",
      },
    ],
  },
];

// 제출 시 동점이면 랜덤(제출 순간에만 1번 동작)
function pickResultTypeRandom(counts: Record<ChoiceType, number>): ChoiceType {
  const maxCount = Math.max(counts.A, counts.B, counts.C, counts.D);
  const candidates = (Object.keys(counts) as ChoiceType[]).filter(
    (t) => counts[t] === maxCount
  );

  // 후보가 1개면 그대로
  if (candidates.length === 1) return candidates[0];

  // 랜덤
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

// highlight 하는 함수
function renderWithHighlight(text: string, highlight?: string[]) {
  if (!highlight || highlight.length === 0) return text;

  let parts: ReactNode[] = [text];

  for (const word of highlight) {
    parts = parts.flatMap((p) => {
      if (typeof p !== "string") return [p];

      return p.split(word).flatMap((chunk, i, arr) => {
        const nodes: ReactNode[] = [chunk];
        if (i < arr.length - 1) {
          nodes.push(
            <span key={`${word}-${i}`} className={styles.highlight}>
              {word}
            </span>
          );
        }
        return nodes;
      });
    });
  }

  return parts;
}

const TestPage: NextPage = () => {
  const router = useRouter();

  // questionId -> optionIndex(0~3)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  // 전부 답했는지
  const isAllAnswered = useMemo(
    () => QUESTIONS.every((q) => answers[q.id] !== undefined),
    [answers]
  );

  // A/B/C/D 카운트
  const counts = useMemo(() => {
    const base: Record<ChoiceType, number> = { A: 0, B: 0, C: 0, D: 0 };

    for (const q of QUESTIONS) {
      const pickedIdx = answers[q.id];
      if (pickedIdx === undefined) continue;

      const t = q.options[pickedIdx]?.type;
      if (!t) continue;

      base[t] += 1;
    }
    return base;
  }, [answers]);

  // 보기 선택
  const onPick = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  // 제출 -> 서버 전송 -> 메인 이동
  const onSubmit = () => {
  if (!isAllAnswered || submitting) return;

  setSubmitting(true);

  const resultType = pickResultTypeRandom(counts);

  router.push({
    pathname: "/mypage/test/result",
    query: { type: resultType },
  });
};

  return (
    <div className={styles.testPage}>
      <Header />

      {/* 헤더 아래 영역: 스크롤 + 가운데 */}
      <main className={styles.testMain}>
        {/* 상단 타이틀 */}
        <section className={styles.testIntro}>
          <b className={styles.testTitle}>모라 유형 검사</b>
          <div className={styles.testSubtitle}>
            정책을 바라보는 나의 관점은?
          </div>
        </section>

        {/* 질문 리스트 */}
        <section className={styles.questionList}>
          {QUESTIONS.map((q) => {
            const picked = answers[q.id];

            return (
              <article key={q.id} className={styles.questionCard}>
                {/* 질문 헤더 */}
                <div className={styles.questionHeader}>
                  <b className={styles.questionIndex}>Q{q.id}.</b>
                  <div className={styles.questionText}>
                    {renderWithHighlight(q.title, q.highlight)}
                  </div>
                </div>

                {/* 보기 목록 */}
                <div className={styles.optionList}>
                  {q.options.map((opt, idx) => {
                    const active = picked === idx;

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`${styles.optionItem} ${
                          active ? styles.optionItemActive : ""
                        }`}
                        onClick={() => onPick(q.id, idx)}
                      >
                        <span className={styles.optionText}>{opt.text}</span>

                        <span className={styles.optionIcon}>
                          <Image
                            src={active ? "/radio_on.svg" : "/radio_off.svg"}
                            alt=""
                            width={18.5}
                            height={18.5}
                            className={styles.radioImg}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}

          {/* 제출 버튼 */}
          <button
            type="button"
            className={styles.submitButton}
            disabled={!isAllAnswered || submitting}
            onClick={onSubmit}
          >
            {submitting ? "제출 중..." : "결과보기!"}
          </button>
        </section>
      </main>
    </div>
  );
};

export default TestPage;
