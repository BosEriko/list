import MediaType from "@type/MediaType";

type StatusOption = {
  value: number;
  label: string;
};

const LISTING_STATUS_OPTIONS: Record<MediaType, StatusOption[]> = {
  anime: [
    { value: 1, label: 'Watching' },
    { value: 2, label: 'Plan to watch' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Rewatching' },
    { value: 5, label: 'Paused' },
    { value: 0, label: 'Dropped' },
  ],
  manga: [
    { value: 1, label: 'Reading' },
    { value: 2, label: 'Plan to read' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Rereading' },
    { value: 5, label: 'Paused' },
    { value: 0, label: 'Dropped' },
  ],
};

export default LISTING_STATUS_OPTIONS;
