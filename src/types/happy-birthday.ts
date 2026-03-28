export type Participant = {
  id: string;
  name: string;
  joinedAt: number;
};

export type Room = {
  id: string;
  name: string;
  createdAt: number;
  startedAt?: number;
  participants: Participant[];
  ownerWishlist: WishlistItem[];
  ownerId: string;
};

export type WishlistItem = {
  id: string;
  text: string;
  description?: string;
  claimedBy?: string; // participantId
};

export type SelfInfo = {
  isOwner: boolean;
  participant: {
    id: string;
    name: string;
  };
  claimedItemId?: string;
  ownerWishlist: WishlistItem[];
  ownerName: string;
  ownerId: string;
};


