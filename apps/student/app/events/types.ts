export interface BaseEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  location: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  participants: {
    count: number;
    registered: Array<{
      id: string;
      avatar: string;
    }>;
  };
  status: "upcoming" | "ongoing" | "completed";
  imageUrl: string;
  description: string;
  capacity?: number;
}

export interface Event extends BaseEvent {
  type: "event";
  category: string;
}

export interface Competition extends BaseEvent {
  type: "competition";
  prize: string;
  deadline: Date;
  requirements: string[];
}

export interface UserEvents {
  registered: (Event | Competition)[];
  attended: (Event | Competition)[];
}