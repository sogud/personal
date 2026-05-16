export type MediaKind = 'text' | 'image' | 'video' | 'audio';

export type MediaItem = {
  kind: MediaKind;
  title: string;
  description?: string;
  href?: string;
  src?: string;
  poster?: string;
  alt?: string;
  meta?: string;
};

export type MediaFolder = {
  slug: string;
  title: string;
  label: string;
  description: string;
  kind: MediaKind;
  items: MediaItem[];
};

export const mediaFolders: MediaFolder[] = [
  {
    slug: 'writing',
    title: 'Writing',
    label: 'Text',
    description: 'Essays, notes, drafts, and fragments.',
    kind: 'text',
    items: [
      {
        kind: 'text',
        title: 'All Essays',
        description: 'Open the writing archive.',
        href: '/blog/',
        meta: 'archive',
      },
      {
        kind: 'text',
        title: 'Terminal',
        description: 'Open the AI terminal app.',
        href: '/apps/terminal/',
        meta: 'app',
      },
    ],
  },
  {
    slug: 'images',
    title: 'Images',
    label: 'Photos',
    description: 'Photography, screenshots, moodboards, and visual notes.',
    kind: 'image',
    items: [
      {
        kind: 'image',
        title: 'Hero Placeholder',
        description: 'Replace this with a real image in public/media/images.',
        src: '/placeholder-hero.jpg',
        alt: 'Placeholder landscape image',
        meta: 'jpg',
      },
      {
        kind: 'image',
        title: 'About Placeholder',
        description: 'A second image slot for testing the folder layout.',
        src: '/placeholder-about.jpg',
        alt: 'Placeholder portrait image',
        meta: 'jpg',
      },
    ],
  },
  {
    slug: 'videos',
    title: 'Videos',
    label: 'Video',
    description: 'Clips, demos, screen recordings, and moving references.',
    kind: 'video',
    items: [],
  },
  {
    slug: 'music',
    title: 'Music',
    label: 'Audio',
    description: 'Tracks, voice notes, mixes, and sound sketches.',
    kind: 'audio',
    items: [],
  },
];

export function getMediaFolder(slug: string) {
  return mediaFolders.find((folder) => folder.slug === slug);
}
