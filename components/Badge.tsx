import { InstallStatus } from "@/types/client";

const tone: Record<InstallStatus, string> = {
  "설치 완료": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "미설치": "bg-slate-100 text-slate-700 ring-slate-200",
  "검수 필요": "bg-amber-50 text-amber-700 ring-amber-200",
  오류: "bg-red-50 text-red-700 ring-red-200"
};

export function StatusBadge({ status }: { status: InstallStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone[status]}`}>
      {status}
    </span>
  );
}
