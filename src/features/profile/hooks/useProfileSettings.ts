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
        description: "Push, e-posta ve uygulama ici tercihleri yonet.",
        pills: [
          { icon: "bell-outline", label: "Bildirimler", tone: "warning" },
          { icon: "cloud-clock-outline", label: "Backend bekleniyor", tone: "neutral" }
        ],
        supportingText:
          "Mesajlar, basvurular ve kampanyalar icin tercih merkezi backend baglandiginda bu karttan yonetilecek.",
        actions: [
          { href: routes.app.messages, label: "Mesajlari Ac", variant: "secondary" },
          { disabled: true, label: "Tercihler yakinda", variant: "ghost" }
        ]
      },
      {
        id: "security",
        title: "Guvenlik",
        description: "Hesap guvenligi ve giris davranislari.",
        pills: [
          { icon: "shield-lock-outline", label: "Guvenlik", tone: "primary" },
          { icon: "account-check-outline", label: "Oturum aktif", tone: "success" }
        ],
        supportingText:
          "Sifre degistirme, cihaz listesi ve oturum yonetimi backend servisleri geldikten sonra bu bloktan acilacak.",
        actions: [
          { href: routes.app.profileEdit, label: "Profili Duzenle", variant: "secondary" },
          { disabled: true, label: "Guvenlik yakinda", variant: "ghost" }
        ]
      },
      {
        id: "privacy",
        title: "Gizlilik",
        description: "Gizlilik ve veri kullanim ayarlari.",
        pills: [
          { icon: "eye-lock-outline", label: "Gizlilik", tone: "neutral" },
          { icon: "toggle-switch-outline", label: "Mod kontrolleri hazir", tone: "primary" }
        ],
        supportingText:
          "Profil gorunurlugu ve veri tercihleri backend baglandiginda bu karttan acilacak; mod ve hesap akislari simdiden hazir.",
        actions: [
          { href: routes.app.profileModes, label: "Modlarimi Ac", variant: "secondary" },
          { disabled: true, label: "Gizlilik ayarlari yakinda", variant: "ghost" }
        ]
      },
      {
        id: "support",
        title: "Destek",
        description: "Yardim merkezi ve destek baglantilari.",
        pills: [
          { icon: "lifebuoy", label: "Destek", tone: "success" },
          { icon: "email-outline", label: "Destek kutusu hazir", tone: "primary" }
        ],
        supportingText:
          "SSS ve destek talepleri backend entegrasyonu ile bu bolumde birikmeye baslayacak; mesaj merkezi simdiden erisilebilir.",
        actions: [
          { href: routes.app.messages, label: "Mesaj Merkezine Git", variant: "secondary" },
          { disabled: true, label: "Destek merkezi yakinda", variant: "ghost" }
        ]
      }
    ],
    enabled: isAuthenticated
  });
}
