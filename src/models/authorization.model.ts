import { ContactId, GroupChatId } from "@open-wa/wa-automate"

export interface Authorization {
  id: ContactId | GroupChatId
  authorization: boolean
}

export interface AuthorizationResponse {
  status: boolean,
  authorization: boolean,
  error: number
}