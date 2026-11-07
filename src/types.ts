/**
 * Dapur KEMAS - Data Dictionary & Types Specification
 * Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK), KEMAS Negeri Perlis
 */

export type RoleUser = 'Admin' | 'Penyumbang' | 'Pengguna';

export type StatusResepi = 'Draf' | 'Disemak' | 'Diterbitkan';

export type TahapKesukaran = 'Mudah' | 'Sederhana' | 'Sukar';

export type UnitBahan =
  | 'gram'
  | 'kg'
  | 'ml'
  | 'liter'
  | 'biji'
  | 'ulas'
  | 'sudu besar'
  | 'sudu teh'
  | 'cawan'
  | 'secukup rasa';

export interface Pengguna {
  Emel: string;
  Nama: string;
  Role: RoleUser;
  Aktif: boolean;
  Password?: string; // Stored in column "password" in Users table, default "kemas123"
}

export interface MasterDataItem {
  Nama: string;
  Aktif: boolean;
}

export interface MasterDataState {
  Kategori_Masakan: MasterDataItem[];
  Etnik_Kaum: MasterDataItem[];
  Negeri_Asal: MasterDataItem[];
  Jenis_Hidangan: MasterDataItem[];
}

export interface BahanResepi {
  ID_Bahan: string;
  ID_Resepi: string;
  Kumpulan_Bahan: string; // e.g. "Bahan Utama", "Bahan Tumis", "Bahan Rempah"
  Nama_Bahan: string;
  Kuantiti: string;
  Unit: UnitBahan;
  Turutan: number;
}

export interface LangkahResepi {
  ID_Langkah: string;
  ID_Resepi: string;
  Nombor_Langkah: number;
  Tajuk_Langkah: string;
  Arahan: string;
  Gambar_Langkah?: string;
  Masa_Minit?: number;
}

export interface ResepiMaster {
  ID_Resepi: string;
  Nama_Resepi: string;
  Kategori_Masakan: string; // Ref -> Kategori_Masakan
  Etnik_Kaum?: string; // Ref -> Etnik_Kaum
  Negeri_Asal?: string; // Ref -> Negeri_Asal
  Jenis_Hidangan: string; // Ref -> Jenis_Hidangan
  Tahap_Kesukaran: TahapKesukaran;
  Masa_Penyediaan_Minit: number;
  Masa_Memasak_Minit: number;
  Bilangan_Hidangan: number;
  Deskripsi: string;
  Gambar_Utama: string;
  Fail_PDF_Cookbook?: string; // URL / status indicator
  Status: StatusResepi;
  Tarikh_Cipta: string; // ISO String or formatted date
  Dicipta_Oleh: string; // User email
  Tarikh_Kemaskini: string;
  
  // Relations populated for convenience
  BahanList?: BahanResepi[];
  LangkahList?: LangkahResepi[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  recipeId: string;
  date: string;
  read: boolean;
}
