"use client";

import { ChevronRight, Waves, KeyRound, Info } from "lucide-react";
import { FormEvent, useState } from "react";
import { login } from "@/lib/api";

interface LoginScreenProps {
  /** Callback invoked after successful authentication. */
  onAuthenticated: () => void;
}

/**
 * Full-screen authentication boundary for the operations command center.
 *
 * Renders a branded sign-in form with email/password fields, accessible
 * labels, autocomplete hints for credential managers, and an inline
 * error display with `role="alert"` for screen-reader announcements.
 *
 * A decorative radar animation reinforces the stadium operations theme
 * without interfering with accessibility (it respects `prefers-reduced-motion`).
 */
import { LanguageSelector } from "./language-selector";

const LOGIN_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "Command sign in",
    subtitle: "STADIUM OPERATIONS CENTER",
    copy: "Use your assigned venue identity. Access and actions are recorded for operational accountability.",
    email: "Email",
    password: "Password",
    submitBtn: "Enter command center",
    authenticating: "Authenticating…",
    demoCreds: "Deployed Demo Credentials:",
    localNote: "Note: If running locally from the repository, use the passwords defined in your local .env file."
  },
  es: {
    title: "Inicio de sesión de comando",
    subtitle: "CENTRO DE OPERACIONES DEL ESTADIO",
    copy: "Use su identidad de lugar asignada. El acceso y las acciones se registran para la rendición de cuentas operativa.",
    email: "Correo electrónico",
    password: "Contraseña",
    submitBtn: "Ingresar al centro de mando",
    authenticating: "Autenticando…",
    demoCreds: "Credenciales de demostración desplegadas:",
    localNote: "Nota: Si se ejecuta localmente desde el repositorio, use las contraseñas definidas en su archivo .env local."
  },
  fr: {
    title: "Connexion de commande",
    subtitle: "CENTRE D'OPÉRATIONS DU STADE",
    copy: "Utilisez l'identité de lieu qui vous a été attribuée. L'accès et les actions sont enregistrés pour la responsabilité opérationnelle.",
    email: "E-mail",
    password: "Mot de passe",
    submitBtn: "Entrer dans le centre de commandement",
    authenticating: "Authentification…",
    demoCreds: "Identifiants de démonstration déployés :",
    localNote: "Remarque : Si vous exécutez localement à partir du référentiel, utilisez les mots de passe définis dans votre fichier .env local."
  },
  ar: {
    title: "تسجيل دخول القيادة",
    subtitle: "مركز عمليات الملعب",
    copy: "استخدم هوية المكان المخصصة لك. يتم تسجيل الدخول والإجراءات للمساءلة التشغيلية.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    submitBtn: "الدخول إلى مركز القيادة",
    authenticating: "جاري التحقق…",
    demoCreds: "بيانات اعتماد العرض التوضيحي المنشورة:",
    localNote: "ملاحظة: في حالة التشغيل محليًا من المستودع، استخدم كلمات المرور المحددة في ملف .env المحلي."
  },
  pt: {
    title: "Entrada de comando",
    subtitle: "CENTRO DE OPERAÇÕES DO ESTÁDIO",
    copy: "Use a sua identidade de local atribuída. O acesso e as ações são gravados para responsabilidade operacional.",
    email: "E-mail",
    password: "Senha",
    submitBtn: "Entrar no centro de comando",
    authenticating: "Autenticando…",
    demoCreds: "Credenciais de demonstração implantadas:",
    localNote: "Nota: Se estiver executando localmente a partir do repositório, use as senhas definidas no seu arquivo .env local."
  },
  de: {
    title: "Befehlsanmeldung",
    subtitle: "STADION-BETRIEBSZENTRUM",
    copy: "Verwenden Sie Ihre zugewiesene Identität. Zugriffe und Aktionen werden zur betrieblichen Rechenschaftspflicht aufgezeichnet.",
    email: "E-Mail",
    password: "Kennwort",
    submitBtn: "Befehlszentrum betreten",
    authenticating: "Authentifizierung…",
    demoCreds: "Bereitgestellte Demo-Zugangsdaten:",
    localNote: "Hinweis: Wenn Sie lokal über das Repository arbeiten, verwenden Sie die in Ihrer lokalen .env-Datei definierten Kennwörter."
  },
  ja: {
    title: "コマンドサインイン",
    subtitle: "スタジアム運営センター",
    copy: "割り当てられた会場の識別情報を使用してください。アクセスとアクションは運営上の説明責任のために記録されます。",
    email: "メールアドレス",
    password: "パスワード",
    submitBtn: "司令センターに入る",
    authenticating: "認証中…",
    demoCreds: "デプロイされたデモ用資格情報：",
    localNote: "注意：リポジトリからローカルで実行する場合は、ローカルの .env ファイルで定義されているパスワードを使用してください。"
  },
  zh: {
    title: "指挥部登录",
    subtitle: "体育场运营中心",
    copy: "使用您分配的场馆身份。访问和操作将被记录，以进行运营问责。",
    email: "电子邮件",
    password: "密码",
    submitBtn: "进入指挥中心",
    authenticating: "正在身份验证…",
    demoCreds: "已部署的演示凭据：",
    localNote: "注意：如果是从存储库在本地运行，请使用本地 .env 文件中密码。"
  }
};

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [email, setEmail] = useState("administrator@arenamind.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState("en");

  const handleUseDemo = () => {
    setEmail("administrator@arenamind.local");
    setPassword("MxgUGVqZuB5rG8kqrGA-Zg");
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      onAuthenticated();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to sign in"
      );
    } finally {
      setBusy(false);
    }
  }

  const t = LOGIN_TRANSLATIONS[lang] || LOGIN_TRANSLATIONS.en;

  return (
    <main id="main" className="login-shell">
      {/* Decorative radar animation — hidden from assistive technology */}
      <div className="login-radar" aria-hidden="true">
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <span />
      </div>

      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10 }}>
        <LanguageSelector onLanguageChange={(code) => setLang(code)} />
      </div>

      <section className="login-panel" aria-labelledby="login-title">
        {/* Branding */}
        <div className="brand login-brand">
          <span className="brandmark">
            <Waves />
          </span>
          <div>
            <strong>ArenaMind</strong>
            <small>Secure operations access</small>
          </div>
        </div>

        <p className="eyebrow">{t.subtitle}</p>
        <h1 id="login-title">{t.title}</h1>
        <p className="login-copy">{t.copy}</p>

        {/* Sign-in form */}
        <form onSubmit={submit}>
          <label htmlFor="email">{t.email}</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">{t.password}</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button disabled={busy}>
            {busy ? t.authenticating : t.submitBtn}
            <ChevronRight />
          </button>
        </form>

        <section aria-label="Demo credentials help panel" style={{ marginTop: "24px", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: "1.4", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            <KeyRound style={{ width: "14px", height: "14px", color: "var(--cyan)" }} /> {t.demoCreds}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", background: "rgba(0, 229, 255, 0.05)", border: "1px solid rgba(0, 229, 255, 0.15)", padding: "10px 12px", borderRadius: "8px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: "1.5" }}>
              <div>{t.email}: <code style={{ color: "#fff" }}>administrator@arenamind.local</code></div>
              <div>{t.password}: <code style={{ color: "#fff" }}>MxgUGVqZuB5rG8kqrGA-Zg</code></div>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              aria-label="Autofill demo credentials"
              style={{
                background: "rgba(0, 229, 255, 0.1)",
                color: "var(--cyan)",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--cyan)";
                e.currentTarget.style.color = "#030712";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 229, 255, 0.1)";
                e.currentTarget.style.color = "var(--cyan)";
              }}
            >
              Autofill
            </button>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "10px", color: "#64748b", lineHeight: "1.4", display: "flex", alignItems: "center", gap: "5px" }}>
            <Info style={{ width: "12px", height: "12px", flexShrink: 0 }} /> <em>{t.localNote}</em>
          </p>
        </section>
      </section>
    </main>
  );
}
