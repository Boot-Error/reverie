export interface ChromeMessagingPipeBuilderParams {
  name: string;
}

export class ChromeMessagingPipe<MessagePayload> {
  private port: chrome.runtime.Port;

  private constructor(pipeName: string) {
    const port = chrome.runtime.connect({ name: pipeName });
    this.port = port;
  }

  public static new<MessagePayload>(params: ChromeMessagingPipeBuilderParams) {
    const pipe = new ChromeMessagingPipe<MessagePayload>(params.name);
    return pipe;
  }

  public subscribe(callback: (payload: MessagePayload) => void) {
    this.port.onMessage.addListener((message: MessagePayload) => {
      callback(message);
    });
  }

  public publish(message: MessagePayload) {
    this.port.postMessage(message);
  }

  public close() {
    this.port.disconnect();
  }
}

export type MessageChannelCallback<MessagePayload> = (
  context: unknown,
  message: MessagePayload,
) => Promise<void>;
export interface MessagingChannel<MessagePayload> {
  name: string;
  send: (context: unknown, message: MessagePayload) => Promise<void>;
  subscribe: (
    context: unknown,
    callback: MessageChannelCallback<MessagePayload>,
  ) => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export type ChannelMessage<MessagePayload> = {
  name: string;
  payload: MessagePayload;
};

export function newMessageChannel<MessagePayload>(name: string) {
  let onMessageCallback: (
    message: ChannelMessage<MessagePayload>,
    sender: chrome.runtime.MessageSender,
  ) => void;
  return {
    name,
    async send(context: unknown, message: MessagePayload) {
      const channelMessage: ChannelMessage<MessagePayload> = {
        name,
        payload: message,
      };
      await chrome.runtime.sendMessage(channelMessage);
    },
    async subscribe(
      context: unknown,
      callback: MessageChannelCallback<MessagePayload>,
    ) {
      onMessageCallback = (
        message: ChannelMessage<MessagePayload>,
        sender: chrome.runtime.MessageSender,
      ) => {
        (async () => {
          const payload = message.payload;
          await callback({ sender }, payload);
        })();
      };
      chrome.runtime.onMessage.addListener(onMessageCallback);
    },
    async unsubscribe() {
      chrome.runtime.onMessage.removeListener(onMessageCallback);
    },
  };
}
