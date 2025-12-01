import { defineType, defineField } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export default defineType({
  name: 'videoBlock',
  title: 'Video Block',
  type: 'object',
  icon: PlayIcon,
  fields: [
    // 1. Video Type
    defineField({
      name: 'videoType',
      type: 'string',
      title: 'Video Type',
      options: {
        list: [
          { title: 'Upload (MP4)', value: 'upload' },
          { title: 'YouTube Embed', value: 'youtube' },
          { title: 'Vimeo Embed', value: 'vimeo' },
          { title: 'Direct URL', value: 'direct' },
        ],
      },
      initialValue: 'upload',
    }),
    // 2. Input (ID, URL or Upload)
    defineField({
      name: 'id',
      type: 'string',
      title: 'Video ID',
      description:
        'YouTube: dQw4w9WgXcQ (from https://youtube.com/watch?v=dQw4w9WgXcQ) or Vimeo: 123456789 (from https://vimeo.com/123456789)',
      hidden: ({ parent }) =>
        parent?.videoType !== 'youtube' && parent?.videoType !== 'vimeo',
    }),
    defineField({
      name: 'videoFile',
      type: 'file',
      title: 'Video File',
      options: {
        accept: 'video/mp4',
      },
      hidden: ({ parent }) => parent?.videoType !== 'upload',
    }),
    defineField({
      name: 'directUrl',
      type: 'url',
      title: 'Video URL',
      description:
        'Directe URL naar video bestand (bijv. Vimeo progressive redirect: https://player.vimeo.com/progressive_redirect/playback/...)',
      hidden: ({ parent }) => parent?.videoType !== 'direct',
    }),
    // 3. Size
    defineField({
      name: 'size',
      type: 'string',
      title: 'Size',
      options: {
        list: [
          { title: 'Content', value: 'content' },
          { title: 'Popout', value: 'popout' },
          { title: 'Feature', value: 'feature' },
          { title: 'Page', value: 'page' },
          { title: 'Full Width', value: 'full' },
          { title: 'Inherit', value: 'inherit' },
        ],
      },
      initialValue: 'page',
    }),
    // 4. Thumbnail
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Thumbnail Image',
      description:
        'Custom thumbnail image for the video (voor poster image en zichtbaar als de video niet autoplayed)',
      options: {
        hotspot: true,
      },
    }),
    // 5. Aspect Ratio
    defineField({
      name: 'ratio',
      type: 'string',
      title: 'Aspect Ratio',
      options: {
        list: [
          { title: '1:1', value: '1:1' },
          { title: '2:1', value: '2:1' },
          { title: '3:2', value: '3:2' },
          { title: '5:2', value: '5:2' },
          { title: '4:3', value: '4:3' },
          { title: '16:9', value: '16:9' },
          { title: '16:10', value: '16:10' },
          { title: '20:9', value: '20:9' },
          { title: '21:9', value: '21:9' },
          { title: '9:16', value: '9:16' },
          { title: '9:20', value: '9:20' },
        ],
      },
      initialValue: '16:9',
    }),
    // 6. Parameters (autoplay, mute, loop)
    defineField({
      name: 'autoplay',
      type: 'boolean',
      title: 'Autoplay',
      initialValue: true,
    }),
    defineField({
      name: 'muted',
      type: 'boolean',
      title: 'Muted',
      initialValue: true,
    }),
    defineField({
      name: 'loop',
      type: 'boolean',
      title: 'Loop',
      initialValue: true,
    }),
    // 7. Title
    defineField({
      name: 'title',
      type: 'string',
      title: 'Video Title',
    }),
    // 8. Caption
    defineField({
      name: 'caption',
      type: 'text',
      title: 'Caption',
      description: 'Onderschrift voor de video',
    }),
    // Hidden fields for embed functionality
    defineField({
      name: 'autoscale',
      type: 'boolean',
      title: 'Autoscale',
      initialValue: true,
      hidden: true, // Hidden - always true for responsive videos
    }),
    defineField({
      name: 'widget',
      type: 'boolean',
      title: 'Widget Mode',
      initialValue: false,
      hidden: true, // Hidden - always false for normal video embeds
    }),
  ],
  preview: {
    select: {
      title: 'title',
      videoType: 'videoType',
      id: 'id',
      size: 'size',
      thumbnail: 'thumbnail',
    },
    prepare({ title, videoType, size, thumbnail }) {
      let subtitle = 'Video Block';
      if (videoType === 'youtube') {
        subtitle = `Video Block • YouTube • ${size || 'page'}`;
      } else if (videoType === 'vimeo') {
        subtitle = `Video Block • Vimeo • ${size || 'page'}`;
      } else if (videoType === 'upload') {
        subtitle = `Video Block • MP4 Upload • ${size || 'page'}`;
      } else if (videoType === 'direct') {
        subtitle = `Video Block • Direct URL • ${size || 'page'}`;
      } else {
        subtitle = `Video Block • ${size || 'page'}`;
      }

      return {
        title: title || 'Video Block',
        subtitle,
        media: thumbnail || PlayIcon,
      };
    },
  },
});
