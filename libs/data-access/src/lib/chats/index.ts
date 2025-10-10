import {
  Chat,
  LastMessageResponse,
  Message,
} from './interfaces/chat.interface';
import { isErrorMessage } from "./interfaces/type-guards";
import { ChatService } from "./services/chat.service";

export {
  ChatService,
  type Chat,
  type Message,
  type LastMessageResponse,
  isErrorMessage
}
