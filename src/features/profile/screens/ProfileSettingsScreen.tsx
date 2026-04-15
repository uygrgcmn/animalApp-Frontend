import { StyleSheet, View } from "react-native";

import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";

export function ProfileSettingsScreen() {
  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <AppHeader
        description="Bildirimler, guvenlik ve destek ayarlari sade bloklar halinde gruplanir."
        showBackButton
        title="Ayarlar"
      />

      <View style={styles.list}>
        <ManagementItemCard
          actions={<AppButton label="Tercihleri Ac" variant="secondary" />}
          description="Push, e-posta ve uygulama ici tercihleri yonet."
          pills={<MetaPill icon="bell-outline" label="Bildirimler" tone="warning" />}
          supportingText="Mesajlar, basvurular ve kampanyalar icin hangi uyarilarin gelmesini istedigini buradan yonetirsin."
          title="Bildirimler"
        />
        <ManagementItemCard
          actions={<AppButton label="Guvenligi Gozden Gecir" variant="secondary" />}
          description="Hesap guvenligi ve giris davranislari."
          pills={<MetaPill icon="shield-lock-outline" label="Guvenlik" tone="primary" />}
          supportingText="Giris hareketleri, oturum davranisi ve temel hesap korumasi burada gruplanir."
          title="Guvenlik"
        />
        <ManagementItemCard
          actions={<AppButton label="Gizlilik Secenekleri" variant="secondary" />}
          description="Gizlilik ve veri kullanim ayarlari."
          pills={<MetaPill icon="eye-lock-outline" label="Gizlilik" tone="neutral" />}
          supportingText="Paylasim, profil ve veri kullanim sinirlarini daha acik bir dille yonetirsin."
          title="Gizlilik"
        />
        <ManagementItemCard
          actions={<AppButton label="Destek Merkezi" variant="secondary" />}
          description="Yardim merkezi ve destek baglantilari."
          pills={<MetaPill icon="lifebuoy" label="Destek" tone="success" />}
          supportingText="Sik sorulanlar, iletisim kanallari ve yardim merkezi bu blokta toplanir."
          title="Destek"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  list: {
    gap: spacing.compact
  }
});
