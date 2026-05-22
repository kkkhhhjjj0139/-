import { Client } from "@/types/client";
import { StatusBadge } from "@/components/Badge";
import { countEnabledTags } from "@/lib/tag-utils";

export function ClientTable({
  clients,
  onSelect
}: {
  clients: Client[];
  onSelect: (client: Client) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-panel text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">광고주명</th>
            <th className="px-4 py-3">사이트 URL</th>
            <th className="px-4 py-3">Client ID</th>
            <th className="px-4 py-3">설치 상태</th>
            <th className="px-4 py-3">활성 태그</th>
            <th className="px-4 py-3">마지막 검수</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {clients.map((client) => (
            <tr key={client.id} className="cursor-pointer hover:bg-blue-50/40" onClick={() => onSelect(client)}>
              <td className="px-4 py-3 font-semibold text-slate-900">{client.name}</td>
              <td className="px-4 py-3 text-slate-600">{client.siteUrl}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-600">{client.clientId}</td>
              <td className="px-4 py-3"><StatusBadge status={client.installStatus} /></td>
              <td className="px-4 py-3">{countEnabledTags(client.tags)}개</td>
              <td className="px-4 py-3 text-slate-500">{client.lastCheckedAt ? new Date(client.lastCheckedAt).toLocaleString("ko-KR") : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
