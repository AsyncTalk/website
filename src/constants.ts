export type AuthorSocial = {
  type: 'youtube' | 'bilibili' | 'xiaohongshu';
  url: string;
  label: string;
};

export type Author = {
  name: string;
  link: string | null;
  socials?: AuthorSocial[];
};

export const authors: Author[] = [{
  name: 'AnnatarHe',
  link: 'https://annatarhe.com',
  socials: [
    {
      type: 'youtube',
      url: 'https://www.youtube.com/@annatarhe',
      label: 'YouTube',
    },
    {
      type: 'bilibili',
      url: 'https://space.bilibili.com/173440264',
      label: 'Bilibili',
    },
    {
      type: 'xiaohongshu',
      url: 'https://www.xiaohongshu.com/user/profile/5b23cdfb11be1002d5f82bd8',
      label: '小红书',
    },
  ],
}, {
  name: 'Sleaf',
  link: 'https://twitter.com/Sleaf_'
}, {
  name: 'Tinko',
  link: 'https://tinko.moe'
}, {
  name: '小鹿',
  link: null
}]

export const evonia = {
  name: 'Evonia.ai',
  url: 'https://evoniaai.github.io/',
  logo: '/evonia/logo-dark.svg',
} as const;
