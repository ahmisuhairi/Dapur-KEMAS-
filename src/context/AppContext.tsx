import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ResepiMaster,
  BahanResepi,
  LangkahResepi,
  Pengguna,
  MasterDataState,
  NotificationItem,
  RoleUser,
} from '../types';
import {
  initialRecipes,
  initialBahanList,
  initialLangkahList,
  initialMasterData,
  initialUsers,
} from '../data/initialData';

interface AppContextType {
  currentUser: Pengguna;
  setCurrentUserEmail: (email: string) => void;
  users: Pengguna[];
  recipes: ResepiMaster[];
  bahanList: BahanResepi[];
  langkahList: LangkahResepi[];
  masterData: MasterDataState;
  notifications: NotificationItem[];

  // Role checks
  isAdmin: boolean;
  isPenyumbang: boolean;
  canEditRecipe: (recipe: ResepiMaster) => boolean;
  canAddRecipe: boolean;

  // Recipe actions
  saveRecipe: (
    recipeData: Partial<ResepiMaster>,
    ingredients: Partial<BahanResepi>[],
    steps: Partial<LangkahResepi>[]
  ) => void;
  deleteRecipe: (id: string) => void;
  approveRecipe: (id: string) => void;
  recordPdfGenerated: (id: string) => void;

  // Master Data actions
  addMasterDataItem: (key: keyof MasterDataState, name: string) => void;
  toggleMasterDataItem: (key: keyof MasterDataState, name: string) => void;

  // User actions
  addUser: (user: Pengguna) => void;
  updateUserRole: (email: string, role: RoleUser) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Authentication
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password: string, role?: RoleUser) => { success: boolean; error?: string };
  logout: () => void;

  // Reset demo data
  resetToDefaultData: () => void;
}

const STORAGE_KEY = 'dapur_kemas_app_storage';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<Pengguna[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_users');
    if (saved) {
      try {
        const parsed: Pengguna[] = JSON.parse(saved);
        return parsed.map((u) => ({
          ...u,
          Password: u.Password || 'kemas123',
        }));
      } catch {
        return initialUsers;
      }
    }
    return initialUsers;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_is_logged_in');
    return saved === 'true';
  });

  const [currentUserEmail, setCurrentUserEmailState] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEY + '_current_email') || initialUsers[0].Emel
    );
  });

  const currentUser =
    users.find((u) => u.Emel.toLowerCase() === currentUserEmail.toLowerCase()) ||
    users[0] ||
    initialUsers[0];

  const [recipes, setRecipes] = useState<ResepiMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_recipes');
    return saved ? JSON.parse(saved) : initialRecipes;
  });

  const [bahanList, setBahanList] = useState<BahanResepi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_bahan');
    return saved ? JSON.parse(saved) : initialBahanList;
  });

  const [langkahList, setLangkahList] = useState<LangkahResepi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_langkah');
    return saved ? JSON.parse(saved) : initialLangkahList;
  });

  const [masterData, setMasterData] = useState<MasterDataState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_master');
    return saved ? JSON.parse(saved) : initialMasterData;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_notifications');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'notif-1',
            title: 'Resepi Draf Baru Memerlukan Semakan',
            message:
              'Penyumbang pm.masakan@kemas.gov.my memasukkan resepi "Gulai Kawah Daging Utara Bersama Umbut Pisang".',
            recipeId: 'RSP-DRAFT-006',
            date: new Date().toISOString(),
            read: false,
          },
        ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_current_email', currentUserEmail);
  }, [currentUserEmail]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_bahan', JSON.stringify(bahanList));
  }, [bahanList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_langkah', JSON.stringify(langkahList));
  }, [langkahList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_master', JSON.stringify(masterData));
  }, [masterData]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY + '_notifications',
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // Derived role flags
  const isAdmin = currentUser.Role === 'Admin';
  const isPenyumbang = currentUser.Role === 'Penyumbang';
  const canAddRecipe = isAdmin || isPenyumbang;

  const canEditRecipe = (recipe: ResepiMaster) => {
    if (isAdmin) return true;
    if (isPenyumbang) {
      return recipe.Status === 'Draf' && recipe.Dicipta_Oleh === currentUser.Emel;
    }
    return false;
  };

  const setCurrentUserEmail = (email: string) => {
    setCurrentUserEmailState(email);
  };

  // Recipe CRUD
  const saveRecipe = (
    recipeData: Partial<ResepiMaster>,
    ingredients: Partial<BahanResepi>[],
    steps: Partial<LangkahResepi>[]
  ) => {
    const now = new Date().toISOString();
    const recipeId = recipeData.ID_Resepi || `RSP-${Date.now()}`;
    const status = isAdmin ? recipeData.Status || 'Diterbitkan' : 'Draf';

    const prepTime = Number(recipeData.Masa_Penyediaan_Minit) || 0;
    const cookTime = Number(recipeData.Masa_Memasak_Minit) || 0;

    const newRecipe: ResepiMaster = {
      ID_Resepi: recipeId,
      Nama_Resepi: recipeData.Nama_Resepi || 'Resepi Tanpa Tajuk',
      Kategori_Masakan: recipeData.Kategori_Masakan || 'Tradisional Warisan',
      Etnik_Kaum: recipeData.Etnik_Kaum || 'Melayu',
      Negeri_Asal: recipeData.Negeri_Asal || 'Perlis',
      Jenis_Hidangan: recipeData.Jenis_Hidangan || 'Lauk Utama',
      Tahap_Kesukaran: recipeData.Tahap_Kesukaran || 'Sederhana',
      Masa_Penyediaan_Minit: prepTime,
      Masa_Memasak_Minit: cookTime,
      Bilangan_Hidangan: Number(recipeData.Bilangan_Hidangan) || 4,
      Deskripsi: recipeData.Deskripsi || '',
      Gambar_Utama:
        recipeData.Gambar_Utama ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      Status: status,
      Tarikh_Cipta: recipeData.Tarikh_Cipta || now,
      Dicipta_Oleh: recipeData.Dicipta_Oleh || currentUser.Emel,
      Tarikh_Kemaskini: now,
      Fail_PDF_Cookbook: recipeData.Fail_PDF_Cookbook || undefined,
    };

    // Replace or Insert recipe master
    setRecipes((prev) => {
      const idx = prev.findIndex((r) => r.ID_Resepi === recipeId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newRecipe;
        return copy;
      }
      return [newRecipe, ...prev];
    });

    // Update ingredients
    const newIngredients: BahanResepi[] = ingredients.map((item, idx) => ({
      ID_Bahan: item.ID_Bahan || `BHN-${Date.now()}-${idx}`,
      ID_Resepi: recipeId,
      Kumpulan_Bahan: item.Kumpulan_Bahan || 'Bahan Utama',
      Nama_Bahan: item.Nama_Bahan || 'Bahan',
      Kuantiti: item.Kuantiti || '1',
      Unit: item.Unit || 'secukup rasa',
      Turutan: item.Turutan || idx + 1,
    }));

    setBahanList((prev) => [
      ...prev.filter((b) => b.ID_Resepi !== recipeId),
      ...newIngredients,
    ]);

    // Update steps
    const newSteps: LangkahResepi[] = steps.map((item, idx) => ({
      ID_Langkah: item.ID_Langkah || `LKG-${Date.now()}-${idx}`,
      ID_Resepi: recipeId,
      Nombor_Langkah: idx + 1,
      Tajuk_Langkah: item.Tajuk_Langkah || `Langkah ${idx + 1}`,
      Arahan: item.Arahan || '',
      Gambar_Langkah: item.Gambar_Langkah || undefined,
      Masa_Minit: item.Masa_Minit ? Number(item.Masa_Minit) : undefined,
    }));

    setLangkahList((prev) => [
      ...prev.filter((l) => l.ID_Resepi !== recipeId),
      ...newSteps,
    ]);

    // Bot 2 simulation: If created as Draf by Penyumbang, notify Admin
    if (!isAdmin && status === 'Draf') {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Notifikasi Draf Baru (Bot 2)',
        message: `Penyumbang ${currentUser.Emel} menambah resepi draf baharu "${newRecipe.Nama_Resepi}". Sila semak untuk kelulusan penerbitan.`,
        recipeId: recipeId,
        date: now,
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.ID_Resepi !== id));
    setBahanList((prev) => prev.filter((b) => b.ID_Resepi !== id));
    setLangkahList((prev) => prev.filter((l) => l.ID_Resepi !== id));
  };

  const approveRecipe = (id: string) => {
    const now = new Date().toISOString();
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.ID_Resepi === id) {
          return {
            ...r,
            Status: 'Diterbitkan',
            Tarikh_Kemaskini: now,
          };
        }
        return r;
      })
    );
  };

  const recordPdfGenerated = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.ID_Resepi === id) {
          const sanitizedName = (r.Nama_Resepi || 'Resepi')
            .replace(/[^a-zA-Z0-9\s_-]/g, '')
            .trim()
            .replace(/\s+/g, '_');
          return {
            ...r,
            Fail_PDF_Cookbook: `Cookbook_${sanitizedName}.pdf`,
          };
        }
        return r;
      })
    );
  };

  // Master Data CRUD
  const addMasterDataItem = (key: keyof MasterDataState, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMasterData((prev) => {
      const list = prev[key] || [];
      if (list.some((item) => item.Nama.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        [key]: [...list, { Nama: trimmed, Aktif: true }],
      };
    });
  };

  const toggleMasterDataItem = (key: keyof MasterDataState, name: string) => {
    setMasterData((prev) => ({
      ...prev,
      [key]: prev[key].map((item) =>
        item.Nama === name ? { ...item, Aktif: !item.Aktif } : item
      ),
    }));
  };

  // Users CRUD
  const addUser = (user: Pengguna) => {
    const newUser: Pengguna = {
      ...user,
      Password: user.Password || 'kemas123',
    };
    setUsers((prev) => {
      if (prev.some((u) => u.Emel.toLowerCase() === newUser.Emel.toLowerCase())) return prev;
      return [...prev, newUser];
    });
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.Emel.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'Emel tidak dijumpai dalam senarai Pengguna.' };
    }
    if (!user.Aktif) {
      return { success: false, error: 'Akaun pengguna ini tidak aktif.' };
    }
    const expectedPassword = user.Password || 'kemas123';
    if (expectedPassword !== password) {
      return { success: false, error: 'Kata laluan salah. (Kata laluan lalai: kemas123)' };
    }

    setCurrentUserEmailState(user.Emel);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEY + '_current_email', user.Emel);
    localStorage.setItem(STORAGE_KEY + '_is_logged_in', 'true');
    return { success: true };
  };

  const registerUser = (
    name: string,
    email: string,
    password: string,
    role: RoleUser = 'Pengguna'
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) return { success: false, error: 'Sila masukkan nama penuh.' };
    if (!cleanEmail) return { success: false, error: 'Sila masukkan alamat emel.' };
    if (!password || password.length < 4) {
      return { success: false, error: 'Kata laluan sekurang-kurangnya 4 aksara.' };
    }
    if (users.some((u) => u.Emel.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Emel ini telah didaftarkan. Sila log masuk.' };
    }

    const newUser: Pengguna = {
      Emel: cleanEmail,
      Nama: name.trim(),
      Role: role,
      Aktif: true,
      Password: password,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserEmailState(cleanEmail);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEY + '_current_email', cleanEmail);
    localStorage.setItem(STORAGE_KEY + '_is_logged_in', 'true');
    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY + '_is_logged_in');
  };

  const updateUserRole = (email: string, role: RoleUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.Emel === email ? { ...u, Role: role } : u))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetToDefaultData = () => {
    setRecipes(initialRecipes);
    setBahanList(initialBahanList);
    setLangkahList(initialLangkahList);
    setMasterData(initialMasterData);
    setUsers(initialUsers);
    setNotifications([]);
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY + '_recipes');
    localStorage.removeItem(STORAGE_KEY + '_bahan');
    localStorage.removeItem(STORAGE_KEY + '_langkah');
    localStorage.removeItem(STORAGE_KEY + '_master');
    localStorage.removeItem(STORAGE_KEY + '_users');
    localStorage.removeItem(STORAGE_KEY + '_notifications');
    localStorage.removeItem(STORAGE_KEY + '_is_logged_in');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserEmail,
        users,
        recipes,
        bahanList,
        langkahList,
        masterData,
        notifications,
        isAdmin,
        isPenyumbang,
        canEditRecipe,
        canAddRecipe,
        saveRecipe,
        deleteRecipe,
        approveRecipe,
        recordPdfGenerated,
        addMasterDataItem,
        toggleMasterDataItem,
        addUser,
        updateUserRole,
        markNotificationRead,
        clearNotifications,
        resetToDefaultData,
        isLoggedIn,
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
