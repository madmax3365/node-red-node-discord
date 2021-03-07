export const NODE_CATEGORY = 'discord';
export const NODE_COLOR = '#7289da';
export const COMMA_SEPARATED_NUMBERS_RE = /^$|^ *\d+ *(?:, *\d+ *)*$/;

export enum NodeStatusMessage {
  CLIENT_READY = 'Ready',
  CLIENT_NO_CONNECTION = 'No internet connection',
  CLIENT_NO_TOKEN = 'Access token not specified',
  CLIENT_WRONG_TOKEN = 'Wrong access token',
  CLIENT_ERROR_UNKNOWN = 'Unknown error',
  CLIENT_EMPTY_MESSAGE = `Can't send empty message`,
  CLIENT_NO_CHANNEL = 'No channel specified',
  CLIENT_CONNECTING = 'Authorizing ...',
  CLIENT_ERROR_CHANNEL_UNKNOWN = `Can't resolve channel with id`,
  CLIENT_MESSAGE_SUCCESS = 'Message sent successfully',
}
