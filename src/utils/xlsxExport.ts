import * as XLSX from 'xlsx';
import { ResepiMaster, BahanResepi, LangkahResepi, Pengguna, MasterDataState } from '../types';

export interface ExportDataPayload {
  recipes: ResepiMaster[];
  bahanList: BahanResepi[];
  langkahList: LangkahResepi[];
  users: Pengguna[];
  masterData: MasterDataState;
}

/**
 * Generates and downloads a complete XLSX Excel workbook formatted specifically 
 * for Google Sheets import for Dapur KEMAS.
 */
export function exportToXLSX(data: ExportDataPayload) {
  const wb = XLSX.utils.book_new();

  // 1. ResepiMaster Sheet
  const recipeRows = data.recipes.map((r) => ({
    ID_Resepi: r.ID_Resepi,
    Nama_Resepi: r.Nama_Resepi,
    Kategori_Masakan: r.Kategori_Masakan,
    Etnik_Kaum: r.Etnik_Kaum || '',
    Negeri_Asal: r.Negeri_Asal || '',
    Jenis_Hidangan: r.Jenis_Hidangan,
    Tahap_Kesukaran: r.Tahap_Kesukaran,
    Masa_Penyediaan_Minit: r.Masa_Penyediaan_Minit,
    Masa_Memasak_Minit: r.Masa_Memasak_Minit,
    Bilangan_Hidangan: r.Bilangan_Hidangan,
    Deskripsi: r.Deskripsi,
    Gambar_Utama: r.Gambar_Utama,
    Fail_PDF_Cookbook:
      r.Fail_PDF_Cookbook ||
      (r.Status === 'Diterbitkan'
        ? `PDF_Cookbook_Output/Cookbook_${r.Nama_Resepi.replace(/\s+/g, '_')}.pdf`
        : ''),
    Status: r.Status,
    Tarikh_Cipta: r.Tarikh_Cipta,
    Dicipta_Oleh: r.Dicipta_Oleh,
    Tarikh_Kemaskini: r.Tarikh_Kemaskini,
  }));
  const wsRecipes = XLSX.utils.json_to_sheet(recipeRows);
  XLSX.utils.book_append_sheet(wb, wsRecipes, 'ResepiMaster');

  // 2. BahanResepi Sheet
  const bahanRows = data.bahanList.map((b) => ({
    ID_Bahan: b.ID_Bahan,
    ID_Resepi: b.ID_Resepi,
    Kumpulan_Bahan: b.Kumpulan_Bahan,
    Nama_Bahan: b.Nama_Bahan,
    Kuantiti: b.Kuantiti,
    Unit: b.Unit,
    Turutan: b.Turutan,
  }));
  const wsBahan = XLSX.utils.json_to_sheet(bahanRows);
  XLSX.utils.book_append_sheet(wb, wsBahan, 'BahanResepi');

  // 3. LangkahResepi Sheet
  const langkahRows = data.langkahList.map((l) => ({
    ID_Langkah: l.ID_Langkah,
    ID_Resepi: l.ID_Resepi,
    Nombor_Langkah: l.Nombor_Langkah,
    Tajuk_Langkah: l.Tajuk_Langkah,
    Arahan: l.Arahan,
    Gambar_Langkah: l.Gambar_Langkah || '',
    Masa_Minit: l.Masa_Minit || 0,
  }));
  const wsLangkah = XLSX.utils.json_to_sheet(langkahRows);
  XLSX.utils.book_append_sheet(wb, wsLangkah, 'LangkahResepi');

  // 4. Pengguna Sheet
  const userRows = data.users.map((u) => ({
    Emel: u.Emel,
    Nama: u.Nama,
    Role: u.Role,
    Aktif: u.Aktif ? 'TRUE' : 'FALSE',
    Password: u.Password || 'kemas123',
  }));
  const wsUsers = XLSX.utils.json_to_sheet(userRows);
  XLSX.utils.book_append_sheet(wb, wsUsers, 'Pengguna');

  // 5. Kategori_Masakan Sheet
  const catRows = data.masterData.Kategori_Masakan.map((m) => ({
    Nama: m.Nama,
    Aktif: m.Aktif ? 'TRUE' : 'FALSE',
  }));
  const wsCat = XLSX.utils.json_to_sheet(catRows);
  XLSX.utils.book_append_sheet(wb, wsCat, 'Kategori_Masakan');

  // 6. Etnik_Kaum Sheet
  const etnikRows = data.masterData.Etnik_Kaum.map((m) => ({
    Nama: m.Nama,
    Aktif: m.Aktif ? 'TRUE' : 'FALSE',
  }));
  const wsEtnik = XLSX.utils.json_to_sheet(etnikRows);
  XLSX.utils.book_append_sheet(wb, wsEtnik, 'Etnik_Kaum');

  // 7. Negeri_Asal Sheet
  const negeriRows = data.masterData.Negeri_Asal.map((m) => ({
    Nama: m.Nama,
    Aktif: m.Aktif ? 'TRUE' : 'FALSE',
  }));
  const wsNegeri = XLSX.utils.json_to_sheet(negeriRows);
  XLSX.utils.book_append_sheet(wb, wsNegeri, 'Negeri_Asal');

  // 8. Jenis_Hidangan Sheet
  const hidanganRows = data.masterData.Jenis_Hidangan.map((m) => ({
    Nama: m.Nama,
    Aktif: m.Aktif ? 'TRUE' : 'FALSE',
  }));
  const wsHidangan = XLSX.utils.json_to_sheet(hidanganRows);
  XLSX.utils.book_append_sheet(wb, wsHidangan, 'Jenis_Hidangan');

  // Export file
  const filename = `Dapur_KEMAS_Database_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}
