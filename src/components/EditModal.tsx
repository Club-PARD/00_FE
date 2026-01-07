import { useEffect, useState } from "react";
import styles from "@/styles/EditModal.module.css";

type Props = {
  isOpen: boolean; // 열렸는지
  initialNickname: string; // 초기 닉네임
  onClose: () => void;
  onSave: (nextNickname: string) => void;
  profileImageUrl?: string; // 있으면 이미지로, 없으면 회색 원
};

export default function EditModal({
  isOpen,
  initialNickname,
  onClose,
  onSave,
  profileImageUrl,
}: Props) {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState<string | null>(null); // 중복/실패 메시지
  const [isSaving, setIsSaving] = useState(false); // 서버 요청 중

  // 모달 열릴 때마다 초기값 띄우기
  useEffect(() => {
    if (isOpen) {
      setNickname(initialNickname);
      setError(null);
      setIsSaving(false);
    }
  }, [isOpen, initialNickname]);

  // ESC로 닫기(선택)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) return; // 공백 저장 방지

    setIsSaving(true);
    setError(null);

    try {
      // !!!!!!!!!!!!!!!!!! API 엔드포인트로 바꿔야 함
      const res = await fetch("/api/user/nickname", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed }),
      });

      if (!res.ok) {
        // !!!!!!!!!! 중복을 409로 준다고 가정 (서버 규격에 맞게 수정)
        if (res.status === 409) {
          setError("사용할 수 없는 닉네임입니다.");
          return;
        }

        setError("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      // 성공
      onSave(trimmed);
    } catch (e) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      {/* 바깥 클릭 시 닫음. 내부 클릭은 막음 */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.frameParent}>
          <div className={styles.ellipseParent}>
            {/* 프로필 원 */}
            {profileImageUrl ? (
              <img className={styles.avatarImg} src={profileImageUrl} alt="" />
            ) : (
              <div className={styles.avatar} />
            )}

            {/* 닉네임 */}
            <div className={styles.field}>
              <div className={styles.label}>닉네임</div>

              <div
                className={`${styles.inputWrap} ${
                  error ? styles.inputWrapError : ""
                }`}
              >
                <input
                  className={styles.input}
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="닉네임을 입력하세요"
                />

                {error && (
                  <img
                    src="/error_red.svg"
                    className={styles.errorIcon}
                    alt=""
                  />
                )}
              </div>

              {error && <div className={styles.errorText}>{error}</div>}
            </div>
          </div>

          {/* 버튼 */}
          <div className={styles.btnRow}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="button"
              className={`${styles.btnSave} ${
                !nickname.trim() || isSaving ? styles.btnSaveDisabled : ""
              }`}
              onClick={handleSave}
              disabled={!nickname.trim() || isSaving}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
