export interface Action {
    tool: string;
    thought?: string;
  }
  
  export interface Message {
    speaker: string;
    designation?: string;
    text: string;
    thoughts?: string;
    actions?: Action[];
    dataType?: 'table' | 'chart';
    data?: any;
  }
  
  export interface ConversationData {
    title: string;
    description: string;
    conversation: Message[];
  }