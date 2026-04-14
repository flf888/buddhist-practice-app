// API配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token存储
const TOKEN_KEY = 'buddhist_app_token';

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};

// 通用请求方法
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = storage.getToken();

  const headers: {[key: string]: string} = {
    'Content-Type': 'application/json',
  };

  // 合并已有的headers
  if (options.headers) {
    const existingHeaders = options.headers as {[key: string]: string};
    Object.assign(headers, existingHeaders);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (data.code !== 0) {
    if (data.code === 9001 || data.code === 9002) {
      storage.removeToken();
      window.location.reload();
    }
    throw new Error(data.message || '请求失败');
  }

  return data.data;
}

// API方法

// 认证相关
export const authApi = {
  sendCode: (phone: string) =>
    request<{ expiresIn: number }>('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  login: (phone: string, code: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  wechatLogin: (code: string) =>
    request<{ token: string; user: User; needBindPhone?: boolean }>(
      '/auth/wechat-login',
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      }
    ),

  logout: () =>
    request<null>('/auth/logout', {
      method: 'POST',
    }),
};

// 用户相关
export const userApi = {
  getProfile: () =>
    request<UserProfile>('/user/profile'),

  updateProfile: (data: { nickname?: string; avatarUrl?: string }) =>
    request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// 设置相关
export const settingsApi = {
  getSettings: () =>
    request<UserSettings>('/settings'),

  updateSettings: (settings: Partial<UserSettings>) =>
    request<UserSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  getDefaults: () =>
    request<SettingsDefaults>('/settings/defaults'),
};

// 模板相关
export const templateApi = {
  getTemplates: (params?: { type?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.category) query.append('category', params.category);
    const queryStr = query.toString();
    return request<Template[]>(`/templates${queryStr ? `?${queryStr}` : ''}`);
  },

  getTemplatesByType: (type: string) =>
    request<TemplateSimple[]>(`/templates/${type}`),

  getTemplateDetail: (id: number) =>
    request<Template>(`/templates/detail/${id}`),
};

// 记录相关
export const recordsApi = {
  createRecord: (data: CreateRecordParams) =>
    request<RecordResult>('/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getRecords: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.type) query.append('type', params.type);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const queryStr = query.toString();
    return request<RecordsResponse>(`/records${queryStr ? `?${queryStr}` : ''}`);
  },

  getStats: () =>
    request<PracticeStats>('/records/stats'),

  getWeekly: () =>
    request<WeeklyData>('/records/weekly'),
};

// 成就相关
export const achievementsApi = {
  getAchievements: () =>
    request<Achievement[]>('/achievements'),

  getUnlocked: () =>
    request<{ count: number; total: number; achievements: Achievement[] }>(
      '/achievements/unlocked'
    ),
};

// 类型定义
export interface User {
  id: number;
  unionId?: string;
  nickname: string;
  avatarUrl?: string;
  phone?: string;
  level: number;
  totalExp: number;
  needBindPhone?: boolean;
}

export interface UserProfile extends User {
  title: string;
  expForNextLevel: number;
  totalDays: number;
  streakDays: number;
  lastPracticeDate?: string;
  createdAt: string;
}

export interface UserSettings {
  morning_nianfo: number;
  morning_chant: number;
  morning_sutra: number;
  morning_chanhui: number;
  evening_nianfo: number;
  evening_chant: number;
  evening_sutra: number;
  evening_chanhui: number;
  baichan_default: number;
}

export interface SettingsDefaults {
  [key: string]: { default: number; min: number; max: number };
}

export interface Template {
  id: number;
  name: string;
  type: string;
  category: string;
  quantity: number;
  unit: string;
  durationSeconds: number;
  voiceGuide?: string;
}

export interface TemplateSimple {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  durationSeconds: number;
  voiceGuide?: string;
}

export interface CreateRecordParams {
  templateId?: number;
  practiceType: string;
  practiceName: string;
  quantity: number;
  unit: string;
  durationSeconds?: number;
  practiceMode?: string;
  sessionType?: string;
}

export interface RecordResult {
  recordId: number;
  expGained: number;
  newLevel: number;
  levelUp: boolean;
  unlockedAchievements: Achievement[];
}

export interface RecordsResponse {
  records: Record[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Record {
  id: number;
  practiceType: string;
  practiceName: string;
  quantity: number;
  unit: string;
  durationSeconds: number;
  expGained: number;
  practiceDate: string;
  createdAt: string;
}

export interface PracticeStats {
  totalNianfo: number;
  totalNianjing: number;
  totalNianzhou: number;
  totalBaichan: number;
  totalExp: number;
  totalDays: number;
  streakDays: number;
  lastPracticeDate?: string;
}

export interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  dailyData: { date: string; day: string; totalExp: number }[];
  weekTotal: number;
}

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  category?: string;
  expReward?: number;
  unlocked?: boolean;
  unlockedAt?: string;
  progress?: { current: number; target: number };
}
