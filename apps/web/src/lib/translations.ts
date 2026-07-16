/**
 * ArenaMind — Multilingual Translation Dictionary
 * =================================================
 * Centralized i18n strings for the operations dashboard.
 *
 * FIFA World Cup 2026 hosts fans from every continent, so the
 * dashboard and AI copilot must operate in multiple languages.
 * This module is the single source of truth for all translatable
 * labels — components import from here rather than maintaining
 * their own copies.
 *
 * To add a language, create a new entry keyed by its ISO 639-1
 * code and provide all label translations.
 */

/** Shape of a single language's translation strings. */
export interface TranslationStrings {
  overview: string;
  crowdIntel: string;
  security: string;
  medical: string;
  workforce: string;
  transport: string;
  sustainability: string;
  navigation: string;
  attendance: string;
  activeIncidents: string;
  medianGateWait: string;
  medicalReadiness: string;
  opsCommand: string;
  systemNominal: string;
  ingressPhase: string;
  stadiumPressure: string;
}

/** ISO 639-1 language codes supported by ArenaMind. */
export type SupportedLanguage = "en" | "es" | "fr" | "ar" | "pt" | "de" | "ja" | "zh";

/** Full translation dictionary keyed by language code. */
export const TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    overview: "Overview",
    crowdIntel: "Crowd intelligence",
    security: "Security",
    medical: "Medical",
    workforce: "Workforce",
    transport: "Transportation",
    sustainability: "Sustainability",
    navigation: "Venue navigation",
    attendance: "Attendance",
    activeIncidents: "Active incidents",
    medianGateWait: "Median gate wait",
    medicalReadiness: "Medical readiness",
    opsCommand: "Operations Command",
    systemNominal: "Connected live",
    ingressPhase: "Ingress · 36 min to kickoff",
    stadiumPressure: "Stadium pressure index",
  },
  es: {
    overview: "Resumen",
    crowdIntel: "Inteligencia de multitudes",
    security: "Seguridad",
    medical: "Médico",
    workforce: "Personal",
    transport: "Transporte",
    sustainability: "Sostenibilidad",
    navigation: "Navegación del estadio",
    attendance: "Asistencia",
    activeIncidents: "Incidentes activos",
    medianGateWait: "Espera media en puertas",
    medicalReadiness: "Disponibilidad médica",
    opsCommand: "Comando de Operaciones",
    systemNominal: "Conectado en vivo",
    ingressPhase: "Ingreso · 36 min para el saque inicial",
    stadiumPressure: "Índice de presión del estadio",
  },
  fr: {
    overview: "Aperçu",
    crowdIntel: "Intelligence de foule",
    security: "Sécurité",
    medical: "Médical",
    workforce: "Effectifs",
    transport: "Transport",
    sustainability: "Durabilité",
    navigation: "Navigation du stade",
    attendance: "Affluence",
    activeIncidents: "Incidents actifs",
    medianGateWait: "Attente moyenne aux portes",
    medicalReadiness: "Préparation médicale",
    opsCommand: "Commandement des Opérations",
    systemNominal: "Connecté en direct",
    ingressPhase: "Entrée · 36 min avant le coup d'envoi",
    stadiumPressure: "Indice de pression du stade",
  },
  ar: {
    overview: "نظرة عامة",
    crowdIntel: "ذكاء الحشود",
    security: "الأمن",
    medical: "الطب",
    workforce: "القوى العاملة",
    transport: "النقل والمواصلات",
    sustainability: "الاستدامة",
    navigation: "ملاحة الملعب",
    attendance: "الحضور",
    activeIncidents: "الحوادث النشطة",
    medianGateWait: "متوسط وقت انتظار البوابات",
    medicalReadiness: "الجاهزية الطبية",
    opsCommand: "قيادة العمليات",
    systemNominal: "متصل مباشر",
    ingressPhase: "الدخول · ٣٦ دقيقة على البداية",
    stadiumPressure: "مؤشر ضغط الملعب",
  },
  pt: {
    overview: "Visão Geral",
    crowdIntel: "Inteligência de público",
    security: "Segurança",
    medical: "Médico",
    workforce: "Equipe",
    transport: "Transporte",
    sustainability: "Sustentabilidade",
    navigation: "Navegação do estádio",
    attendance: "Público",
    activeIncidents: "Incidentes ativos",
    medianGateWait: "Espera média nos portões",
    medicalReadiness: "Prontidão médica",
    opsCommand: "Comando de Operações",
    systemNominal: "Conectado ao vivo",
    ingressPhase: "Ingresso · 36 min para o pontapé inicial",
    stadiumPressure: "Índice de pressão do estádio",
  },
  de: {
    overview: "Übersicht",
    crowdIntel: "Zuschauer-Intelligenz",
    security: "Sicherheit",
    medical: "Medizinisch",
    workforce: "Personal",
    transport: "Transport",
    sustainability: "Nachhaltigkeit",
    navigation: "Stadion-Navigation",
    attendance: "Zuschauerzahl",
    activeIncidents: "Aktive Vorfälle",
    medianGateWait: "Mittlere Wartezeit am Tor",
    medicalReadiness: "Medizinische Bereitschaft",
    opsCommand: "Einsatzleitung",
    systemNominal: "Live verbunden",
    ingressPhase: "Einlass · 36 Min. bis zum Anpfiff",
    stadiumPressure: "Stadiondruck-Index",
  },
  ja: {
    overview: "概要",
    crowdIntel: "群衆インテリジェンス",
    security: "警備",
    medical: "医療",
    workforce: "スタッフ人員",
    transport: "交通機関",
    sustainability: "サステナビリティ",
    navigation: "スタジアム案内",
    attendance: "来場者数",
    activeIncidents: "アクティブなインシデント",
    medianGateWait: "平均ゲート待ち時間",
    medicalReadiness: "医療対応状態",
    opsCommand: "運営司令センター",
    systemNominal: "ライブ接続中",
    ingressPhase: "入場中 · キックオフまで36分",
    stadiumPressure: "スタジアム圧力インデックス",
  },
  zh: {
    overview: "概述",
    crowdIntel: "人群智能",
    security: "安保",
    medical: "医疗",
    workforce: "工作人员",
    transport: "交通运输",
    sustainability: "可持续发展",
    navigation: "场馆导航",
    attendance: "到场人数",
    activeIncidents: "活跃事件",
    medianGateWait: "平均闸机排队时间",
    medicalReadiness: "医疗准备就绪率",
    opsCommand: "运营指挥中心",
    systemNominal: "在线连接",
    ingressPhase: "入场中 · 距离开球还有36分钟",
    stadiumPressure: "体育场拥挤度指数",
  },
};

/**
 * Returns the translated label for a sidebar navigation item.
 *
 * Maps the canonical English key to the user's selected language.
 * Falls back to the original English label for unmapped keys.
 */
export function getNavLabel(label: string, t: TranslationStrings): string {
  switch (label) {
    case "Overview": return t.overview;
    case "Crowd intelligence": return t.crowdIntel;
    case "Security": return t.security;
    case "Medical": return t.medical;
    case "Workforce": return t.workforce;
    case "Transportation": return t.transport;
    case "Sustainability": return t.sustainability;
    case "Venue navigation": return t.navigation;
    default: return label;
  }
}
