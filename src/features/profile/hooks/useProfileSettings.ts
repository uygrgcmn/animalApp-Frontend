import type { Href } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { routes } from "../../../core/navigation/routes";
import { queryKeys } from "../../../core/query/queryKeys";
import type { AppIconName } from "../../../shared/ui/AppIcon";
import { useSessionStore } from "../../auth/store/sessionStore";

type SettingsPillTone = "primary" | "success" | "warning" | "neutral";
type SettingsButtonVariant = "primary" | "secondary" | "ghost";

export type ProfileSettingsAction = {
  disabled?: boolean;
  href?: Href;
  label: string;
  variant: SettingsButtonVariant;
};

export type ProfileSettingsSection = {
  actions: ProfileSettingsAction[];
  description: string;
  id: string;
  pills: {
    icon: AppIconName;
    label: string;
    tone: SettingsPillTone;
  }[];
  supportingText: string;
  title: string;
};

export function useProfileSettings() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.profile.settings,
    queryFn: async (): Promise<ProfileSettingsSection[]> => [
      {
        id: "notifications",
        title: "Bildirimler",
        description: "Push, e-posta ve uygulama içi tercihleri yönet.",
        pills: [
          { icon: "bell-outline", label: "Bildirimler", tone: "warning" },
          { icon: "cloud-clock-outline", label: "Backend bekleniyor", tone: "neutral" }
        ],
        supportingText:
          "Mesajlar, başvurular ve kampanyalar için tercih merkezi backend bağlandığında bu karttan yönetilecek.",
        actions: [
          { href: routes.app.messages, label: "Mesajları Aç", variant: "secondary" },
          { disabled: true, label: "Tercihler yakında", variant: "ghost" }
        ]
      },
      {
        id: "security",
        title: "Güvenlik",
        description: "Hesap güvenliği ve giriş davranışları.",
        pills: [
          { icon: "shield-lock-outline", label: "Güvenlik", tone: "primary" },
          { icon: "account-check-outline", label: "Oturum aktif", tone: "success" }
        ],
        supportingText:
          "Şifre değiştirme, cihaz listesi ve oturum yönetimi backend servisleri geldikten sonra bu bloktan açılacak.",
        actions: [
          { href: routes.app.profileEdit, label: "Profili Düzenle", variant: "secondary" },
          { disabled: true, label: "Güvenlik yakında", variant: "ghost" }
        ]
      },
      {
        id: "privacy",
        title: "Gizlilik",
        description: "Gizlilik ve veri kullanım ayarları.",
        pills: [
          { icon: "eye-lock-outline", label: "Gizlilik", tone: "neutral" },
          { icon: "toggle-switch-outline", label: "Mod kontrolleri hazır", tone: "primary" }
        ],
        supportingText:
          "Profil görünürlüğü ve veri tercihleri backend bağlandığında bu karttan açılacak; mod ve hesap akışları şimdiden hazır.",
        actions: [
          { href: routes.app.profileModes, label: "Modlarımı Aç", variant: "secondary" },
          { disabled: true, label: "Gizlilik ayarları yakında", variant: "ghost" }
        ]
      },
      {
        id: "support",
        title: "Destek",
        description: "Yardım merkezi ve destek bağlantıları.",
        pills: [
          { icon: "lifebuoy", label: "Destek", tone: "success" },
          { icon: "email-outline", label: "Destek kutusu hazır", tone: "primary" }
        ],
        supportingText:
          "SSS ve destek talepleri backend entegrasyonu ile bu bölümde birikmeye başlayacak; mesaj merkezi şimdiden erişilebilir.",
        actions: [
          { href: routes.app.messages, label: "Mesaj Merkezine Git", variant: "secondary" },
          { disabled: true, label: "Destek merkezi yakında", variant: "ghost" }
        ]
      }
    ],
    enabled: isAuthenticated
  });
}
