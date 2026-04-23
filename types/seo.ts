export interface SeoData {
  seo_score: number;
  details: string[];
}

export type AuditStatus = "passed" | "warning" | "error";

export interface TechnicalData {
  title: { content: string; status: AuditStatus };
  meta: { content: string; status: AuditStatus };
  headings: { content: string; status: AuditStatus };
  images: { content: string; status: AuditStatus };
}
