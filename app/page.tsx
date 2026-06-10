"use client";

import { Copy, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClientTable } from "@/components/ClientTable";
import { Shell } from "@/components/Shell";
import { StatusBadge } from "@/components/Badge";
import { Toggle } from "@/components/Toggle";
import { createEmptyClient } from "@/lib/defaults";
import { countEnabledTags, createInstallScript } from "@/lib/tag-utils";
import { Client, EventConfig, InstallStatus, MallPlatform, ValidationItem } from "@/types/client";

const platforms: MallPlatform[] = ["카페24", "고도몰", "메이크샵", "아임웹", "식스샵", "Shopify", "기타"];
const statuses: InstallStatus[] = ["설치 완료", "미설치", "검수 필요", "오류"];

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([]);
  const [validationHtml, setValidationHtml] = useState("");
  const [publicOrigin, setPublicOrigin] = useState("http://localhost:3000");

  const selected = useMemo(() => clients.find((client) => client.id === selectedId) || clients[0], [clients, selectedId]);
  const installScript = selected ? createInstallScript(selected.clientId, publicOrigin) : "";

  const loadClients = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        const detail = data?.error?.message ? ` (${data.error.message})` : "";
        throw new Error(`${data?.message || "광고주 목록을 불러오지 못했습니다."}${detail}`);
      }

      setClients(data);
      if (!selectedId && data[0]) setSelectedId(data[0].id);
    } catch (error) {
      setClients([]);
      setErrorMessage(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    setPublicOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (selected) setDraft(structuredClone(selected));
  }, [selected]);

  async function createClient() {
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...createEmptyClient(), name: "신규 광고주", siteUrl: "https://" })
    });
    const client = await response.json();
    await loadClients();
    setSelectedId(client.id);
    setActive("clients");
  }

  async function saveDraft() {
    if (!draft) return;
    const response = await fetch(`/api/clients/${draft.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const client = await response.json();
    setClients((prev) => prev.map((item) => (item.id === client.id ? client : item)));
    setDraft(client);
  }

  async function deleteSelected() {
    if (!draft) return;
    await fetch(`/api/clients/${draft.id}`, { method: "DELETE" });
    setDraft(null);
    setSelectedId("");
    await loadClients();
  }

  async function validateInstall() {
    if (!selected) return;
    const response = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: selected.clientId, url: selected.siteUrl, html: validationHtml })
    });
    const result = await response.json();
    setValidationItems(result.items || []);
    await loadClients();
  }

  async function seedInitialClients() {
    const response = await fetch("/api/admin/seed", { method: "POST" });
    const result = await response.json();
    await loadClients();
    alert(result.message || "초기 데이터 복원을 실행했습니다.");
  }

  const metrics = [
    { label: "등록 광고주", value: `${clients.length}개` },
    { label: "설치 완료", value: `${clients.filter((client) => client.installStatus === "설치 완료").length}개` },
    { label: "검수 필요", value: `${clients.filter((client) => client.installStatus === "검수 필요").length}개` },
    { label: "활성 태그", value: `${clients.reduce((sum, client) => sum + countEnabledTags(client.tags), 0)}개` }
  ];

  return (
    <Shell active={active} onNavigate={setActive}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">전환스크립트 자동 설치/관리</h1>
          <p className="mt-1 text-sm text-slate-500">광고주별 통합 스크립트와 매체 태그를 한 곳에서 관리합니다.</p>
        </div>
        <button className="btn btn-primary" onClick={createClient}><Plus size={16} /> 신규 광고주 등록</button>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-line bg-white p-8 text-sm text-slate-500">불러오는 중입니다.</div>
      ) : (
        <>
          {active === "dashboard" && (
            <section className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-line bg-white p-5 shadow-soft">
                    <div className="text-xs font-semibold text-slate-500">{metric.label}</div>
                    <div className="mt-2 text-2xl font-black text-slate-950">{metric.value}</div>
                  </div>
                ))}
              </div>
              <ClientTable clients={clients} onSelect={(client) => { setSelectedId(client.id); setActive("clients"); }} />
            </section>
          )}

          {active === "clients" && draft && (
            <section className="grid grid-cols-[280px_1fr] gap-5">
              <ClientSelector clients={clients} selectedId={draft.id} onSelect={setSelectedId} />
              <div className="space-y-5">
                <Panel title="광고주 등록/수정" action={<StatusBadge status={draft.installStatus} />}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="광고주명" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
                    <Field label="사이트 URL" value={draft.siteUrl} onChange={(value) => setDraft({ ...draft, siteUrl: value })} />
                    <div>
                      <label className="label">쇼핑몰 솔루션 유형</label>
                      <select className="field" value={draft.mallPlatform} onChange={(event) => setDraft({ ...draft, mallPlatform: event.target.value as MallPlatform })}>
                        {platforms.map((platform) => <option key={platform}>{platform}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">설치 상태</label>
                      <select className="field" value={draft.installStatus} onChange={(event) => setDraft({ ...draft, installStatus: event.target.value as InstallStatus })}>
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                    <Field label="Client ID 자동 생성" value={draft.clientId} readOnly />
                    <div className="col-span-2">
                      <label className="label">담당자 메모</label>
                      <textarea className="field min-h-24" value={draft.memo} onChange={(event) => setDraft({ ...draft, memo: event.target.value })} />
                    </div>
                  </div>
                </Panel>
                <TagEditor draft={draft} setDraft={setDraft} />
                <EventEditor draft={draft} setDraft={setDraft} />
                <div className="flex justify-end gap-2">
                  <button className="btn btn-danger" onClick={deleteSelected}><Trash2 size={16} /> 삭제</button>
                  <button className="btn btn-primary" onClick={saveDraft}><Save size={16} /> 저장</button>
                </div>
              </div>
            </section>
          )}

          {active === "scripts" && selected && (
            <Panel title="통합 설치 스크립트 발급" action={<button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(installScript)}><Copy size={16} /> 복사</button>}>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <Info label="광고주" value={selected.name} />
                <Info label="Client ID" value={selected.clientId} />
                <Info label="사이트" value={selected.siteUrl} />
              </div>
              <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-blue-100">{installScript}</pre>
              <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm text-blue-900">
                공통 스크립트는 &lt;/head&gt; 이전 또는 공통 HEAD 영역에 설치하세요. 구매완료 이벤트는 구매완료 페이지에서 실행 조건 URL을 설정하면 됩니다.
              </div>
            </Panel>
          )}

          {active === "validate" && selected && (
            <Panel title="설치 검수" action={<button className="btn btn-primary" onClick={validateInstall}><RefreshCw size={16} /> 검수 실행</button>}>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Info label="URL 검수 대상" value={selected.siteUrl} />
                <Info label="Client ID" value={selected.clientId} />
              </div>
              <label className="label">HTML 붙여넣기 검수</label>
              <textarea className="field min-h-44 font-mono text-xs" placeholder="외부 URL fetch가 제한될 경우 광고주 사이트 HTML 소스를 붙여넣어 검수하세요." value={validationHtml} onChange={(event) => setValidationHtml(event.target.value)} />
              <div className="mt-5 grid gap-3">
                {validationItems.map((item) => (
                  <div key={item.label} className="flex items-start justify-between rounded-md border border-line bg-panel p-3">
                    <div>
                      <div className="font-semibold text-slate-900">{item.label}</div>
                      <div className="mt-1 text-sm text-slate-500">{item.message}</div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${item.status === "pass" ? "bg-emerald-100 text-emerald-700" : item.status === "warn" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {active === "settings" && (
            <Panel title="설정" action={<button className="btn btn-secondary" onClick={seedInitialClients}>초기 데이터 복원</button>}>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <Info label="저장 방식" value="로컬 JSON 파일" />
                <Info label="운영 저장소" value="Supabase 환경변수 설정 시 Supabase 사용" />
                <Info label="향후 확장" value="Supabase, Firebase, 로그인, 권한 관리" />
                <Info label="보안 전제" value="관리자 권한이 있는 광고주 사이트에만 직접 설치" />
              </div>
            </Panel>
          )}
        </>
      )}
    </Shell>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-black text-slate-950">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, readOnly }: { label: string; value: string; onChange?: (value: string) => void; readOnly?: boolean }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="field" value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-panel p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 break-all text-sm font-semibold text-slate-800">{value || "-"}</div>
    </div>
  );
}

function ClientSelector({ clients, selectedId, onSelect }: { clients: Client[]; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="rounded-lg border border-line bg-white p-3 shadow-soft">
      {clients.map((client) => (
        <button key={client.id} className={`mb-2 w-full rounded-md p-3 text-left text-sm ${selectedId === client.id ? "bg-blue-50 text-brand" : "hover:bg-slate-50"}`} onClick={() => onSelect(client.id)}>
          <div className="font-bold">{client.name}</div>
          <div className="mt-1 truncate font-mono text-xs text-slate-500">{client.clientId}</div>
        </button>
      ))}
    </div>
  );
}

function TagEditor({ draft, setDraft }: { draft: Client; setDraft: (client: Client) => void }) {
  return (
    <Panel title="매체별 태그 관리">
      <div className="grid gap-4">
        <TagRow title="GA4" enabled={draft.tags.ga4.enabled} onEnabled={(enabled) => setDraft({ ...draft, tags: { ...draft.tags, ga4: { ...draft.tags.ga4, enabled } } })}>
          <Field label="Measurement ID" value={draft.tags.ga4.measurementId} onChange={(value) => setDraft({ ...draft, tags: { ...draft.tags, ga4: { ...draft.tags.ga4, measurementId: value } } })} />
        </TagRow>
        <TagRow title="Google Ads" enabled={draft.tags.googleAds.enabled} onEnabled={(enabled) => setDraft({ ...draft, tags: { ...draft.tags, googleAds: { ...draft.tags.googleAds, enabled } } })}>
          <Field label="Conversion ID" value={draft.tags.googleAds.conversionId} onChange={(value) => setDraft({ ...draft, tags: { ...draft.tags, googleAds: { ...draft.tags.googleAds, conversionId: value } } })} />
          <Field label="Conversion Label" value={draft.tags.googleAds.conversionLabel} onChange={(value) => setDraft({ ...draft, tags: { ...draft.tags, googleAds: { ...draft.tags.googleAds, conversionLabel: value } } })} />
        </TagRow>
        <TagRow title="Naver" enabled={draft.tags.naver.enabled} onEnabled={(enabled) => setDraft({ ...draft, tags: { ...draft.tags, naver: { ...draft.tags.naver, enabled } } })}>
          <Field label="네이버 전환 스크립트 ID 또는 전체 스크립트" value={draft.tags.naver.scriptIdOrCode} onChange={(value) => setDraft({ ...draft, tags: { ...draft.tags, naver: { ...draft.tags.naver, scriptIdOrCode: value } } })} />
        </TagRow>
        <TagRow title="Meta Pixel" enabled={draft.tags.meta.enabled} onEnabled={(enabled) => setDraft({ ...draft, tags: { ...draft.tags, meta: { ...draft.tags.meta, enabled } } })}>
          <Field label="Pixel ID" value={draft.tags.meta.pixelId} onChange={(value) => setDraft({ ...draft, tags: { ...draft.tags, meta: { ...draft.tags.meta, pixelId: value } } })} />
        </TagRow>
        <TagRow title="Danggeun" enabled={draft.tags.danggeun.enabled} onEnabled={(enabled) => setDraft({ ...draft, tags: { ...draft.tags, danggeun: { ...draft.tags.danggeun, enabled } } })}>
          <Field label="Pixel ID 또는 전체 스크립트" value={draft.tags.danggeun.scriptIdOrCode} onChange={(value) => setDraft({ ...draft, tags: { ...draft.tags, danggeun: { ...draft.tags.danggeun, scriptIdOrCode: value } } })} />
        </TagRow>
      </div>
    </Panel>
  );
}

function TagRow({ title, enabled, onEnabled, children }: { title: string; enabled: boolean; onEnabled: (enabled: boolean) => void; children: ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-black text-slate-900">{title}</div>
        <Toggle checked={enabled} onChange={onEnabled} label={`${title} 사용 여부`} />
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function EventEditor({ draft, setDraft }: { draft: Client; setDraft: (client: Client) => void }) {
  function updateEvent(key: string, patch: Partial<EventConfig>) {
    setDraft({ ...draft, events: draft.events.map((event) => event.key === key ? { ...event, ...patch } : event) });
  }

  return (
    <Panel title="이벤트 관리">
      <div className="overflow-hidden rounded-md border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2">이벤트</th>
              <th className="px-3 py-2">사용</th>
              <th className="px-3 py-2">URL contains</th>
              <th className="px-3 py-2">전환값</th>
              <th className="px-3 py-2">매출액 변수명</th>
              <th className="px-3 py-2">주문번호 변수명</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {draft.events.map((event) => (
              <tr key={event.key}>
                <td className="px-3 py-2 font-semibold">{event.key}</td>
                <td className="px-3 py-2"><Toggle checked={event.enabled} onChange={(enabled) => updateEvent(event.key, { enabled })} /></td>
                <td className="px-3 py-2"><input className="field" value={event.urlContains} onChange={(change) => updateEvent(event.key, { urlContains: change.target.value })} /></td>
                <td className="px-3 py-2"><Toggle checked={event.useValue} onChange={(useValue) => updateEvent(event.key, { useValue })} /></td>
                <td className="px-3 py-2"><input className="field" value={event.revenueVariableName} onChange={(change) => updateEvent(event.key, { revenueVariableName: change.target.value })} /></td>
                <td className="px-3 py-2"><input className="field" value={event.orderIdVariableName} onChange={(change) => updateEvent(event.key, { orderIdVariableName: change.target.value })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
