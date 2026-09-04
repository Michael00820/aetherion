import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ThemeProvider } from "@/lib/theme";
import "../styles.css";
import appCss from "../styles.css?url";
import cssText from "../styles.css?inline";

const APP_NAME = "Aetherion";

const CRITICAL_CSS = `html,body{margin:0;height:100%;overflow:hidden;background:#14110c;color:#f3ead7}
.starfield{display:flex;flex-direction:column;height:100dvh;max-height:100dvh;overflow:hidden;color:var(--fg,#f3ead7);background:var(--bg,#14110c)}
@media (max-width:767px){nav[aria-label="Primary"]{display:none!important}}
@media (min-width:768px){nav[aria-label="Primary mobile"]{display:none!important}}
nav[aria-label="Primary mobile"]{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex}
.orbit-stage{position:relative;flex:1;min-height:0;height:100%;width:100%}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "An observatory of the Ethiopian calendar, planetary hours, the solar system, and the Tewahedo scriptures.",
      },
      { name: "theme-color", content: "#14110c" },
      { name: "color-scheme", content: "dark" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    styles: [{ children: `${CRITICAL_CSS}\n${cssText}` }],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning data-theme="gold">
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: `${CRITICAL_CSS}\n${cssText}` }} />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
