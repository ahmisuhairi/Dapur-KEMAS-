/**
 * ==============================================================================
 * DAPUR KEMAS V1.00 - GOOGLE APPS SCRIPT BACKEND (Code.gs)
 * Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK), KEMAS Negeri Perlis
 * ==============================================================================
 * Rangka Kerja Backend Google Apps Script & Google Sheets Database API
 * 
 * Pengendalian Mod Binding:
 * 1. Container-Bound (Google Sheet -> Extensions -> Apps Script): Menggunakan SpreadsheetApp.getActiveSpreadsheet()
 * 2. Standalone Script: Menggunakan SPREADSHEET_ID yang ditetapkan di bawah.
 * 
 * Penjanaan PDF:
 * - PDF dijana terus (on-demand) pada peranti pengguna semasa butang ditekan
 *   menggunakan client-side PDF renderer / browser print engine (tanpa simpanan Google Drive).
 */

// SPREADSHEET_ID UNTUK MOD STANDALONE (Boleh digantikan dengan ID Google Sheet anda jika skrip ini standalone)
var SPREADSHEET_ID = '1GANTI_DENGAN_ID_GOOGLE_SHEET_ANDA';

// 1. DUA MOD OPERASI: Web UI (HtmlService) & REST API (ContentService)
function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action) {
      return handleApiRequest(e.parameter);
    }
    
    var template = HtmlService.createTemplateFromFile('Index');
    return template.evaluate()
        .setTitle('Dapur KEMAS V1.00 - Sistem Resepi Digital Perlis')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput(
      "<h3 style='color:red;'>Ralat Pelayan Apps Script:</h3><pre>" + err.toString() + "</pre>"
    );
  }
}

function doPost(e) {
  try {
    var postData = {};
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      postData = e.parameter;
    }
    
    var result = handlePostAction(postData);
    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Ralat Pemprosesan POST: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// 2. DAPATKAN PEMEGANG GOOGLE SPREADSHEET (Container-Bound & Standalone Support)
function getDb() {
  var ss = null;
  
  // Mod 1: Container-Bound
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    ss = null;
  }
  
  // Mod 2: Standalone Script menggunakan SPREADSHEET_ID
  if (!ss && SPREADSHEET_ID && SPREADSHEET_ID !== '1GANTI_DENGAN_ID_GOOGLE_SHEET_ANDA') {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      Logger.log("Ralat Membuka Spreadsheet ID: " + e.toString());
    }
  }
  
  return ss;
}

// Menu Tambahan Dalam Google Sheet (Sesuai untuk Container-Bound)
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Dapur KEMAS V1.00')
      .addItem('⚡ Jalankan Setup Pangkalan Data', 'setupDatabaseSheets')
      .addToUi();
  } catch (e) {
    // Abaikan jika dijalankan di luar UI Spreadsheet
  }
}

// 3. AUTO-SETUP DATABASE: BINA 8 JADUAL JIKA BELUM WUJUD
function setupDatabaseSheets() {
  try {
    var ss = getDb();
    if (!ss) {
      return { 
        success: false, 
        error: "Google Sheet tidak dijumpai. Sila pastikan Apps Script dibuka daripada menu Extensions > Apps Script dalam Google Sheet, atau gantikan SPREADSHEET_ID." 
      };
    }

    var sheetsSpec = {
      'ResepiMaster': ['ID_Resepi', 'Nama_Resepi', 'Kategori_Masakan', 'Etnik_Kaum', 'Negeri_Asal', 'Jenis_Hidangan', 'Tahap_Kesukaran', 'Masa_Penyediaan_Minit', 'Masa_Memasak_Minit', 'Bilangan_Hidangan', 'Deskripsi', 'Gambar_Utama', 'Fail_PDF_Cookbook', 'Status', 'Tarikh_Cipta', 'Dicipta_Oleh', 'Tarikh_Kemaskini'],
      'BahanResepi': ['ID_Bahan', 'ID_Resepi', 'Kumpulan_Bahan', 'Nama_Bahan', 'Kuantiti', 'Unit', 'Turutan'],
      'LangkahResepi': ['ID_Langkah', 'ID_Resepi', 'Nombor_Langkah', 'Tajuk_Langkah', 'Arahan', 'Gambar_Langkah', 'Masa_Minit'],
      'Pengguna': ['Emel', 'Nama', 'Role', 'Aktif'],
      'Kategori_Masakan': ['Nama', 'Aktif'],
      'Etnik_Kaum': ['Nama', 'Aktif'],
      'Negeri_Asal': ['Nama', 'Aktif'],
      'Jenis_Hidangan': ['Nama', 'Aktif']
    };

    var createdCount = 0;
    for (var sheetName in sheetsSpec) {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(sheetsSpec[sheetName]);
        sheet.getRange(1, 1, 1, sheetsSpec[sheetName].length)
             .setFontWeight('bold')
             .setBackground('#1e293b')
             .setFontColor('#ffffff');
        createdCount++;
      }
    }

    seedDefaultDataIfEmpty(ss);

    return {
      success: true,
      message: "Database Dapur KEMAS V1.00 berjaya disiapkan! (" + createdCount + " sheet baharu dicipta)"
    };
  } catch (err) {
    return { success: false, error: "Ralat Setup Database: " + err.toString() };
  }
}

// 4. PEMBENIHAN DATA AWAL KEMAS PERLIS
function seedDefaultDataIfEmpty(ss) {
  if (!ss) return;

  // 1. Pengguna
  var userSheet = ss.getSheetByName('Pengguna');
  if (userSheet && userSheet.getLastRow() <= 1) {
    userSheet.appendRow(['admin.pkk@kemas.gov.my', 'Ketua Unit PKK KEMAS Perlis', 'Admin', 'TRUE']);
    userSheet.appendRow(['pm.masakan@kemas.gov.my', 'Pn. Azizah (Pemaju Masyarakat Masakan)', 'Penyumbang', 'TRUE']);
    userSheet.appendRow(['staf.kemas@kemas.gov.my', 'En. Rosli (Peserta / Staf KEMAS)', 'Pengguna', 'TRUE']);
  }

  // 2. Kategori Masakan
  var catSheet = ss.getSheetByName('Kategori_Masakan');
  if (catSheet && catSheet.getLastRow() <= 1) {
    ['Tradisional Warisan', 'Masakan Harian', 'Kuih-Muih Tradisional', 'Pencuci Mulut', 'Minuman & Sarapan', 'Panggang & BBQ'].forEach(function(c) {
      catSheet.appendRow([c, 'TRUE']);
    });
  }

  // 3. Etnik Kaum
  var etnikSheet = ss.getSheetByName('Etnik_Kaum');
  if (etnikSheet && etnikSheet.getLastRow() <= 1) {
    ['Melayu', 'Cina', 'India', 'Peranakan / Nyonya', 'Siam / Thai Perlis', 'Sabah & Sarawak'].forEach(function(e) {
      etnikSheet.appendRow([e, 'TRUE']);
    });
  }

  // 4. Negeri Asal
  var negeriSheet = ss.getSheetByName('Negeri_Asal');
  if (negeriSheet && negeriSheet.getLastRow() <= 1) {
    ['Perlis', 'Kedah', 'Pulau Pinang', 'Perak', 'Selangor', 'Kelantan', 'Terengganu', 'Pahang', 'Johor', 'Melaka', 'Negeri Sembilan'].forEach(function(n) {
      negeriSheet.appendRow([n, 'TRUE']);
    });
  }

  // 5. Jenis Hidangan
  var hidanganSheet = ss.getSheetByName('Jenis_Hidangan');
  if (hidanganSheet && hidanganSheet.getLastRow() <= 1) {
    ['Lauk Utama', 'Pembuka Selera', 'Sampingan & Ulaman', 'Sup & Kuah', 'Pencuci Mulut / Dessert', 'Sarapan / Minum Petang'].forEach(function(h) {
      hidanganSheet.appendRow([h, 'TRUE']);
    });
  }

  // 6. Benihkan Resepi Warisan Penuh jika ResepiMaster kosong
  var recipeSheet = ss.getSheetByName('ResepiMaster');
  var bahanSheet = ss.getSheetByName('BahanResepi');
  var langkahSheet = ss.getSheetByName('LangkahResepi');

  if (recipeSheet && recipeSheet.getLastRow() <= 1) {
    var now = new Date().toISOString();
    
    // Resepi 1: Rendang Daging Warisan Perlis
    recipeSheet.appendRow([
      'RSP-PERLIS-001', 'Rendang Daging Warisan Perlis', 'Tradisional Warisan', 'Melayu', 'Perlis',
      'Lauk Utama', 'Sederhana', 30, 90, 6,
      'Resepi ikonik warisan KEMAS Negeri Perlis. Menggunakan rempah-ratus segar tempatan, kerisik kelapa sangai wangi, dan santan pekat asli untuk menghasilkan rendang bersantan legap bernuansa tradisi utara.',
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800',
      'Cookbook_Rendang_Daging_Warisan_Perlis.pdf', 'Diterbitkan', now, 'admin.pkk@kemas.gov.my', now
    ]);

    // Resepi 2: Laksa Perlis Berkuah Pekat
    recipeSheet.appendRow([
      'RSP-PERLIS-002', 'Laksa Perlis Berkuah Pekat', 'Tradisional Warisan', 'Melayu', 'Perlis',
      'Lauk Utama', 'Sederhana', 40, 45, 5,
      'Laksa Perlis mempunyai kelainan khas dengan kuah ikan selayang rebus berserta daun kesum, bunga kantan segar dan daun selasih utara yang mengharumkan aroma masakan.',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
      'Cookbook_Laksa_Perlis_Berkuah_Pekat.pdf', 'Diterbitkan', now, 'pm.masakan@kemas.gov.my', now
    ]);

    // Resepi 3: Ikan Bakar Petai Sos Sambal Perlis
    recipeSheet.appendRow([
      'RSP-PERLIS-003', 'Ikan Bakar Petai Sos Sambal Perlis', 'Panggang & BBQ', 'Siam / Thai Perlis', 'Perlis',
      'Lauk Utama', 'Mudah', 20, 25, 4,
      'Ikan siakap atau kembung segar dibalut daun pisang bersama pes sambal cili padi, asam jawa, dan taburan biji petai mentah lalu dibakar atas bara kayu.',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
      'Cookbook_Ikan_Bakar_Petai_Sos_Sambal_Perlis.pdf', 'Diterbitkan', now, 'pm.masakan@kemas.gov.my', now
    ]);

    // Resepi 4: Pulut Mempelam Harum Manis Perlis
    recipeSheet.appendRow([
      'RSP-PERLIS-004', 'Pulut Mempelam Harum Manis Perlis', 'Pencuci Mulut', 'Melayu', 'Perlis',
      'Pencuci Mulut / Dessert', 'Mudah', 25, 30, 4,
      'Sajian pemanis mulut kebanggaan Negeri Perlis. Pulut kukus bersantan wangi disajikan bersama hirisan buah Mempelam Harum Manis manis lekit dan santan pekat bergaram halus.',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800',
      'Cookbook_Pulut_Mempelam_Harum_Manis_Perlis.pdf', 'Diterbitkan', now, 'admin.pkk@kemas.gov.my', now
    ]);

    // Resepi 5: Kuih Seri Muka Pandan Tradisional
    recipeSheet.appendRow([
      'RSP-MALAYSIA-005', 'Kuih Seri Muka Pandan Tradisional', 'Kuih-Muih Tradisional', 'Melayu', 'Kedah',
      'Sarapan / Minum Petang', 'Sederhana', 30, 40, 8,
      'Kuih talam dua lapisan: lapisan bawah pulut gurih dan lapisan atas kastard pandan hijau lembut berasaskan ekstrak daun pandan asli dan santan kelapa segar.',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
      'Cookbook_Kuih_Seri_Muka_Pandan_Tradisional.pdf', 'Diterbitkan', now, 'pm.masakan@kemas.gov.my', now
    ]);

    // Resepi 6 (Draf): Gulai Kawah Daging Utara Bersama Umbut Pisang
    recipeSheet.appendRow([
      'RSP-DRAFT-006', 'Gulai Kawah Daging Utara Bersama Umbut Pisang', 'Tradisional Warisan', 'Melayu', 'Perlis',
      'Lauk Utama', 'Sukar', 35, 75, 10,
      'Resepi gulai kawah katering kenduri warisan utara. Daging lembu pejal dimasak perlahan bersama umbut pisang segar dan pes rempah kawah kaya rempah ratus.',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
      '', 'Draf', now, 'pm.masakan@kemas.gov.my', now
    ]);

    // Bahan-bahan asas
    if (bahanSheet && bahanSheet.getLastRow() <= 1) {
      // Rendang
      bahanSheet.appendRow(['BHN-001', 'RSP-PERLIS-001', 'Bahan Utama', 'Daging lembu pejal (dihiris tebal)', '1', 'kg', 1]);
      bahanSheet.appendRow(['BHN-002', 'RSP-PERLIS-001', 'Bahan Utama', 'Santan pekat segar', '500', 'ml', 2]);
      bahanSheet.appendRow(['BHN-003', 'RSP-PERLIS-001', 'Bahan Utama', 'Kerisik sangai wangi', '4', 'sudu besar', 3]);
      bahanSheet.appendRow(['BHN-004', 'RSP-PERLIS-001', 'Bahan Kisar', 'Bawang merah kecil & Bawang putih', '12', 'ulas', 4]);
      bahanSheet.appendRow(['BHN-005', 'RSP-PERLIS-001', 'Bahan Kisar', 'Serai segar, Lengkuas, Halia', '4', 'batang', 5]);
      bahanSheet.appendRow(['BHN-006', 'RSP-PERLIS-001', 'Bahan Aromatik', 'Daun kunyit (dicarik halus)', '2', 'helai', 6]);
      // Laksa
      bahanSheet.appendRow(['BHN-010', 'RSP-PERLIS-002', 'Bahan Kuah', 'Ikan selayang / kembung rebus', '1', 'kg', 1]);
      bahanSheet.appendRow(['BHN-011', 'RSP-PERLIS-002', 'Bahan Kuah', 'Asam keping & Asam jawa', '6', 'keping', 2]);
      bahanSheet.appendRow(['BHN-012', 'RSP-PERLIS-002', 'Ulaman & Hidangan', 'Laksa beras segar', '1', 'kg', 3]);
      bahanSheet.appendRow(['BHN-013', 'RSP-PERLIS-002', 'Ulaman & Hidangan', 'Daun kesum, Bunga kantan, Daun selasih', '1', 'ikat', 4]);
      // Pulut
      bahanSheet.appendRow(['BHN-020', 'RSP-PERLIS-004', 'Bahan Pulut', 'Beras pulut susu (rendam 3 jam)', '500', 'gram', 1]);
      bahanSheet.appendRow(['BHN-021', 'RSP-PERLIS-004', 'Bahan Santan', 'Santan kelapa segar & Garam halus', '300', 'ml', 2]);
      bahanSheet.appendRow(['BHN-022', 'RSP-PERLIS-004', 'Buah Utama', 'Mempelam Harum Manis Perlis (ranum)', '3', 'biji', 3]);
    }

    // Langkah-langkah asas
    if (langkahSheet && langkahSheet.getLastRow() <= 1) {
      langkahSheet.appendRow(['LKG-001', 'RSP-PERLIS-001', 1, 'Penyediaan Bahan & Kisar Rempah', 'Kisar bawang merah, bawang putih, halia, lengkuas, serai, cili kering dan kunyit hidup dengan sedikit air.', '', 15]);
      langkahSheet.appendRow(['LKG-002', 'RSP-PERLIS-001', 2, 'Menumis Pes & Memasukkan Daging', 'Panaskan minyak kelapa dalam kuali tebal. Tumis pes kisar sehingga terbit minyak wangi. Masukkan hirisan daging dan kacau rata.', '', 20]);
      langkahSheet.appendRow(['LKG-003', 'RSP-PERLIS-001', 3, 'Memasukkan Santan & Mereneh Perlahan', 'Tuangkan santan pekat segar dan asam keping. Renihkan dengan api kecil sederhana selama 45-60 minit.', '', 45]);
      langkahSheet.appendRow(['LKG-004', 'RSP-PERLIS-001', 4, 'Menambah Kerisik & Daun Kunyit', 'Masukkan kerisik sangai wangi, gula melaka, dan garam. Kacau berterusan sehingga kuah pekat legap dan berminyak berkilat.', '', 25]);
      langkahSheet.appendRow(['LKG-010', 'RSP-PERLIS-002', 1, 'Rebus Ikan & Kisar Kuah', 'Rebus ikan kembung bersama asam keping. Asingkan isi ikan daripada tulang. Kisar isi ikan halus bersama sedikit air rebusan.', '', 25]);
      langkahSheet.appendRow(['LKG-011', 'RSP-PERLIS-002', 2, 'Mereneh Kuah Laksa', 'Didihkan kuah bersama pes cili kisar, belacan bakar, daun kesum, dan hirisan bunga kantan sehingga pekat harum.', '', 35]);
      langkahSheet.appendRow(['LKG-020', 'RSP-PERLIS-004', 1, 'Mengukus Pulut', 'Kukus beras pulut selama 20 minit. Angkat, gaulkan bersama santan pekat dan garam sehingga berkilat, kemudian kukus semula 10 minit.', '', 30]);
    }
  }
}

// 5. PEMBACA DATA SPREADSHEET KE ARRAY OBJECT JSON (Selamat Dari Serialization Error)
function getSheetDataAsJson(sheetName) {
  try {
    var ss = getDb();
    if (!ss) return [];
    
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    var headers = data[0];
    var result = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
      var isEmptyRow = true;
      for (var j = 0; j < headers.length; j++) {
        var val = row[j];
        if (val !== '' && val !== null && val !== undefined) {
          isEmptyRow = false;
        }
        // Penukaran selamat bagi objek Date Apps Script kepada String ISO
        if (val instanceof Date) {
          val = val.toISOString();
        }
        obj[headers[j]] = val !== undefined ? val : '';
      }
      if (!isEmptyRow) result.push(obj);
    }
    return result;
  } catch (err) {
    Logger.log("Ralat membaca sheet " + sheetName + ": " + err.toString());
    return [];
  }
}

// 6. OPERASI UTAMA AMBIL DATA (Auto-Inisialisasi jika sheet belum sedia)
function apiGetAllData() {
  try {
    var ss = getDb();

    // Jika spreadsheet wujud tetapi belum disetup, jalankan auto-setup
    if (ss) {
      var rSheet = ss.getSheetByName('ResepiMaster');
      if (!rSheet || rSheet.getLastRow() <= 1) {
        setupDatabaseSheets();
      }
    }

    var recipes = getSheetDataAsJson('ResepiMaster');
    var bahanList = getSheetDataAsJson('BahanResepi');
    var langkahList = getSheetDataAsJson('LangkahResepi');
    var users = getSheetDataAsJson('Pengguna');
    var masterData = {
      Kategori_Masakan: getSheetDataAsJson('Kategori_Masakan'),
      Etnik_Kaum: getSheetDataAsJson('Etnik_Kaum'),
      Negeri_Asal: getSheetDataAsJson('Negeri_Asal'),
      Jenis_Hidangan: getSheetDataAsJson('Jenis_Hidangan')
    };

    var isFallback = false;
    var note = "";
    if (!ss) {
      isFallback = true;
      note = "Amaran: Google Sheet belum dihubungkan. Menggunakan data sampel KEMAS Perlis.";
    }

    return {
      success: true,
      isFallback: isFallback,
      note: note,
      recipes: recipes,
      bahanList: bahanList,
      langkahList: langkahList,
      users: users,
      masterData: masterData
    };
  } catch (err) {
    return { 
      success: false, 
      error: "Ralat mengambil data: " + err.toString() 
    };
  }
}

// 7. SIMPAN / KEMASKINI RESEPI
function apiSaveRecipe(recipeData, bahanArray, langkahArray) {
  try {
    var ss = getDb();
    if (!ss) {
      return { success: false, error: "Google Sheet tidak dijumpai. Sila jalankan setup." };
    }

    var recipeSheet = ss.getSheetByName('ResepiMaster');
    var bahanSheet = ss.getSheetByName('BahanResepi');
    var langkahSheet = ss.getSheetByName('LangkahResepi');

    if (!recipeSheet || !bahanSheet || !langkahSheet) {
      setupDatabaseSheets();
      recipeSheet = ss.getSheetByName('ResepiMaster');
      bahanSheet = ss.getSheetByName('BahanResepi');
      langkahSheet = ss.getSheetByName('LangkahResepi');
    }

    var recipe = typeof recipeData === 'string' ? JSON.parse(recipeData) : recipeData;
    var bahanList = typeof bahanArray === 'string' ? JSON.parse(bahanArray) : (bahanArray || []);
    var langkahList = typeof langkahArray === 'string' ? JSON.parse(langkahArray) : (langkahArray || []);

    if (!recipe.Nama_Resepi || !recipe.Kategori_Masakan) {
      return { success: false, error: "Nama Resepi dan Kategori Masakan adalah wajib." };
    }

    var recipeId = recipe.ID_Resepi || ('RSP-' + Date.now());
    var now = new Date().toISOString();

    var data = recipeSheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === recipeId) {
        rowIndex = i + 1;
        break;
      }
    }

    var rowVal = [
      recipeId, recipe.Nama_Resepi, recipe.Kategori_Masakan, recipe.Etnik_Kaum || 'Melayu',
      recipe.Negeri_Asal || 'Perlis', recipe.Jenis_Hidangan || 'Lauk Utama', recipe.Tahap_Kesukaran || 'Sederhana',
      recipe.Masa_Penyediaan_Minit || 15, recipe.Masa_Memasak_Minit || 30, recipe.Bilangan_Hidangan || 4,
      recipe.Deskripsi || '', recipe.Gambar_Utama || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      recipe.Fail_PDF_Cookbook || ('Cookbook_' + recipe.Nama_Resepi.replace(/\s+/g, '_') + '.pdf'),
      recipe.Status || 'Draf', recipe.Tarikh_Cipta || now, recipe.Dicipta_Oleh || 'admin.pkk@kemas.gov.my', now
    ];

    if (rowIndex > -1) {
      recipeSheet.getRange(rowIndex, 1, 1, rowVal.length).setValues([rowVal]);
    } else {
      recipeSheet.appendRow(rowVal);
    }

    cleanRowsById(bahanSheet, 1, recipeId);
    bahanList.forEach(function(b, idx) {
      bahanSheet.appendRow([
        b.ID_Bahan || ('BHN-' + Date.now() + '-' + idx),
        recipeId, b.Kumpulan_Bahan || 'Bahan Utama', b.Nama_Bahan || 'Bahan', b.Kuantiti || '1', b.Unit || 'secukup rasa', b.Turutan || (idx + 1)
      ]);
    });

    cleanRowsById(langkahSheet, 1, recipeId);
    langkahList.forEach(function(l, idx) {
      langkahSheet.appendRow([
        l.ID_Langkah || ('LKG-' + Date.now() + '-' + idx),
        recipeId, idx + 1, l.Tajuk_Langkah || ('Langkah ' + (idx + 1)), l.Arahan || '', l.Gambar_Langkah || '', l.Masa_Minit || 0
      ]);
    });

    return {
      success: true,
      message: "Resepi '" + recipe.Nama_Resepi + "' berjaya disimpan ke Google Sheet!",
      recipeId: recipeId
    };
  } catch (err) {
    return { success: false, error: "Ralat Menyimpan Resepi: " + err.toString() };
  }
}

function cleanRowsById(sheet, colIndexZeroBased, matchId) {
  try {
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][colIndexZeroBased] === matchId) {
        sheet.deleteRow(i + 1);
      }
    }
  } catch (err) {
    Logger.log("Ralat pembersihan baris: " + err.toString());
  }
}

// 8. LULUSKAN RESEPI DRAF (ADMIN SAHAJA)
function apiApproveRecipe(recipeId) {
  try {
    var ss = getDb();
    if (!ss) return { success: false, error: "Database Google Sheet tidak ditemui." };
    
    var sheet = ss.getSheetByName('ResepiMaster');
    if (!sheet) return { success: false, error: "Sheet ResepiMaster tidak dijumpai." };
    
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === recipeId) {
        var recipeName = data[i][1] || 'Resepi';
        var pdfName = 'Cookbook_' + recipeName.replace(/\s+/g, '_') + '.pdf';
        sheet.getRange(i + 1, 13).setValue(pdfName);
        sheet.getRange(i + 1, 14).setValue('Diterbitkan');
        sheet.getRange(i + 1, 17).setValue(new Date().toISOString());
        
        return {
          success: true,
          message: "Resepi " + recipeId + " berjaya diluluskan dan diterbitkan! PDF sedia dijana terus bila-bila masa.",
        };
      }
    }
    return { success: false, error: "ID Resepi " + recipeId + " tidak dijumpai." };
  } catch (err) {
    return { success: false, error: "Ralat Kelulusan Resepi: " + err.toString() };
  }
}

// 9. PADAM RESEPI
function apiDeleteRecipe(recipeId) {
  try {
    var ss = getDb();
    if (!ss) return { success: false, error: "Database Google Sheet tidak ditemui." };

    var rSheet = ss.getSheetByName('ResepiMaster');
    var bSheet = ss.getSheetByName('BahanResepi');
    var lSheet = ss.getSheetByName('LangkahResepi');

    if (rSheet) cleanRowsById(rSheet, 0, recipeId);
    if (bSheet) cleanRowsById(bSheet, 1, recipeId);
    if (lSheet) cleanRowsById(lSheet, 1, recipeId);

    return { success: true, message: "Resepi " + recipeId + " berjaya dipadam." };
  } catch (err) {
    return { success: false, error: "Ralat Pemadaman: " + err.toString() };
  }
}

// 10. MASTER DATA MANAGEMENT (TAKSONOMI)
function apiAddMasterItem(tableName, name) {
  try {
    var ss = getDb();
    if (!ss) return { success: false, error: "Database Google Sheet tidak ditemui." };

    var sheet = ss.getSheetByName(tableName);
    if (!sheet) return { success: false, error: "Jadual '" + tableName + "' tidak wujud." };

    sheet.appendRow([name, 'TRUE']);
    return { success: true, message: "'" + name + "' ditambah ke " + tableName };
  } catch (err) {
    return { success: false, error: "Ralat Tambah Item: " + err.toString() };
  }
}

function apiToggleMasterItem(tableName, name) {
  try {
    var ss = getDb();
    if (!ss) return { success: false, error: "Database Google Sheet tidak ditemui." };

    var sheet = ss.getSheetByName(tableName);
    if (!sheet) return { success: false, error: "Jadual tidak ditemui." };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === name) {
        var current = (data[i][1] === true || String(data[i][1]).toUpperCase() === 'TRUE');
        var newVal = current ? 'FALSE' : 'TRUE';
        sheet.getRange(i + 1, 2).setValue(newVal);
        return { success: true, message: "Status '" + name + "' ditukar kepada " + newVal };
      }
    }
    return { success: false, error: "Item tidak ditemui." };
  } catch (err) {
    return { success: false, error: "Ralat Tukar Status: " + err.toString() };
  }
}

// 11. PENGURUSAN PENGGUNA (ROLE ADMIN / PENYUMBANG / PENGGUNA)
function apiAddUser(email, name, role) {
  try {
    var ss = getDb();
    if (!ss) return { success: false, error: "Database Google Sheet tidak ditemui." };

    var sheet = ss.getSheetByName('Pengguna');
    if (!sheet) return { success: false, error: "Jadual Pengguna tidak wujud." };

    sheet.appendRow([email, name, role || 'Pengguna', 'TRUE']);
    return { success: true, message: "Pengguna '" + name + "' (" + role + ") berjaya didaftarkan!" };
  } catch (err) {
    return { success: false, error: "Ralat Tambah Pengguna: " + err.toString() };
  }
}

function apiUpdateUserRole(email, role) {
  try {
    var ss = getDb();
    if (!ss) return { success: false, error: "Database Google Sheet tidak ditemui." };

    var sheet = ss.getSheetByName('Pengguna');
    if (!sheet) return { success: false, error: "Jadual Pengguna tidak wujud." };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email) {
        sheet.getRange(i + 1, 3).setValue(role);
        return { success: true, message: "Peranan " + email + " ditukar kepada " + role };
      }
    }
    return { success: false, error: "Emel staf tidak dijumpai." };
  } catch (err) {
    return { success: false, error: "Ralat Kemaskini Role Staf: " + err.toString() };
  }
}

// 12. ROUTING PERMINTAAN API REST / WEB APP
function handleApiRequest(param) {
  var res = {};
  if (param.action === 'getAll') {
    res = apiGetAllData();
  } else if (param.action === 'setup') {
    res = setupDatabaseSheets();
  } else {
    res = { success: false, error: "Tindakan API '" + param.action + "' tidak dikenali." };
  }
  return ContentService.createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
}

function handlePostAction(postData) {
  if (postData.action === 'saveRecipe') {
    return apiSaveRecipe(postData.recipe, postData.bahanList, postData.langkahList);
  } else if (postData.action === 'approveRecipe') {
    return apiApproveRecipe(postData.recipeId);
  } else if (postData.action === 'deleteRecipe') {
    return apiDeleteRecipe(postData.recipeId);
  } else if (postData.action === 'addMasterItem') {
    return apiAddMasterItem(postData.tableName, postData.name);
  } else if (postData.action === 'toggleMasterItem') {
    return apiToggleMasterItem(postData.tableName, postData.name);
  } else if (postData.action === 'addUser') {
    return apiAddUser(postData.email, postData.name, postData.role);
  } else if (postData.action === 'updateUserRole') {
    return apiUpdateUserRole(postData.email, postData.role);
  }
  return { success: false, error: "Tindakan POST tidak dikenali." };
}
