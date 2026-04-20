import { siteSettings } from "@/lib/site-settings";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.
        </p>
        <p className="muted">Built for consultations, travel support, and relocation guidance.</p>
      </div>
    </footer>
  );
}
