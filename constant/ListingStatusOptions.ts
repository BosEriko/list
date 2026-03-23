export type ListingType = 'anime' | 'manga' | 'game' | 'movie';

export type StatusOption = {
  value: number;
  label: string;
};

const ListingStatusOptions: Record<ListingType, StatusOption[]> = {
  anime: [
    { value: 0, label: 'Dropped' },
    { value: 1, label: 'Watching' },
    { value: 2, label: 'Plan to watch' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Rewatching' },
    { value: 5, label: 'Paused' },
  ],
  manga: [
    { value: 0, label: 'Dropped' },
    { value: 1, label: 'Reading' },
    { value: 2, label: 'Plan to read' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Rereading' },
    { value: 5, label: 'Paused' },
  ],
  game: [
    { value: 0, label: 'Dropped' },
    { value: 1, label: 'Playing' },
    { value: 2, label: 'Wishlist' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Replay' },
    { value: 5, label: 'Paused' },
  ],
  movie: [
    { value: 0, label: 'Dropped' },
    { value: 1, label: 'Watching' },
    { value: 2, label: 'Plan to watch' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Rewatching' },
    { value: 5, label: 'Paused' },
  ],
};

export default ListingStatusOptions
