
export const authors = [{
  name: 'AnnatarHe',
  link: 'https://annatarhe.com'
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

export const socialLinks = [
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
] as const;

export const evonia = {
  name: 'Evonia.ai',
  url: 'https://evoniaai.github.io/',
  logo: '/evonia/logo-dark.svg',
} as const;

// Base URL where per-episode Slidev decks are hosted (the video-slides repo,
// deployed to GitHub Pages). The deck for an episode lives at `${SLIDES_BASE_URL}/<ep>/`.
// Change this if the decks move to a custom domain.
export const SLIDES_BASE_URL = 'https://asynctalk.github.io/video-slides';
