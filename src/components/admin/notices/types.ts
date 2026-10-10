export interface NoticeDTO {
    _id: string;
    title: string;
    message: string;
    image: string; // empty string = no image
    active: boolean;
  }