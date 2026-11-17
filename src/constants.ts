export const authors = [{
  name: 'AnnatarHe',
  initial: 'A',
  link: 'https://annatarhe.com'
}, {
  name: 'Sleaf',
  initial: 'S',
  link: 'https://twitter.com/Sleaf_'
}, {
  name: 'Tinko',
  initial: 'T',
  link: 'https://tinko.moe'
}, {
  name: '小鹿',
  initial: '鹿',
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

export const podcastLinks = {
  applePodcasts:
    "https://podcasts.apple.com/cn/podcast/asynctalk-s01/id1590369272",
  xiaoyuzhou:
    "https://www.xiaoyuzhoufm.com/podcast/61684ce4d8fa23fb00fc4d3a",
  spotify: "https://open.spotify.com/show/6AMzdZxcztIoKlZrGX79lX",
} as const;

// The three podcast directories shown in the header.
export const podcastChannels = [
  { title: 'Apple Podcast', link: podcastLinks.applePodcasts },
  { title: '小宇宙', link: podcastLinks.xiaoyuzhou },
  { title: 'Spotify', link: podcastLinks.spotify },
] as const;

// Every place the show can be followed, for the homepage 收听渠道 section.
export const listenChannels = [
  { title: '小宇宙', kind: '播客', link: podcastLinks.xiaoyuzhou },
  { title: 'Apple Podcast', kind: '播客', link: podcastLinks.applePodcasts },
  { title: 'Spotify', kind: '播客', link: podcastLinks.spotify },
  ...socialLinks.map((s) => ({ title: s.label, kind: '视频', link: s.url })),
  { title: 'RSS', kind: '订阅源', link: '/rss.xml' },
];

export const evonia = {
  name: 'Evonia.ai',
  url: 'https://evoniaai.github.io/',
  logo: '/evonia/logo.svg',
  logoDark: '/evonia/logo-dark.svg',
} as const;

// Base URL where per-episode Slidev decks are hosted (the video-slides repo,
// deployed to GitHub Pages). The deck for an episode lives at `${SLIDES_BASE_URL}/<ep>/`.
// Change this if the decks move to a custom domain.
export const SLIDES_BASE_URL = 'https://asynctalk.github.io/video-slides';

// Episodes per page on /posts/ and /posts/page/<n>/.
// Keep scripts/check-seo.mjs (POSTS_PAGE_SIZE) in sync.
export const POSTS_PAGE_SIZE = 12;
