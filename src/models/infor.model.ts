import { GroupChatId } from "@open-wa/wa-automate";

export interface Infor {
  id: GroupChatId;
  text: string;
}

export interface InforResponse {
  status: boolean;
  infor: Infor | null;
  error: number;
}