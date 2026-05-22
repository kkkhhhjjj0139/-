import { BarChart3, ClipboardCheck, Code2, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";

const items = [
  { key: "dashboard", label: "대시보드", icon: BarChart3 },
  { key: "clients", label: "광고주 관리", icon: Users },
  { key: "scripts", label: "설치 스크립트", icon: Code2 },
  { key: "validate", label: "설치 검수", icon: ClipboardCheck },
  { key: "settings", label: "설정", icon: Settings }
];

export function Shell({
  active,
  onNavigate,
  children
}: {
  active: string;
  onNavigate: (key: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-line bg-white px-4 py-5">
        <div className="mb-8">
          <div className="text-lg font-black text-slate-900">Conversion Hub</div>
          <div className="mt-1 text-xs text-slate-500">광고대행사 태그 관리 콘솔</div>
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const selected = active === item.key;
            return (
              <button
                key={item.key}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${
                  selected ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => onNavigate(item.key)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="ml-64 min-h-screen flex-1 p-8">{children}</main>
    </div>
  );
}
