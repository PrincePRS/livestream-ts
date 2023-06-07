// @ts-check
import Pusher, { Channel } from "pusher-js";

const stringifyWithNull = (obj: any) =>
  JSON.stringify(obj, (k, v) => (v === undefined ? null : v));

/**
 * On whiteboard close, owner sends current state to remote peers.
 * Remote peers tear down too quickly(unsubscribing listeners) and are unable to store the last state.
 *
 * Hack: To overcome this, attach 2 listeners:
 * one for storing the message(won't be unsubscribed),
 * one for calling the actual whiteboard callback(will be unsubscribed on whiteboard close)
 *
 * This way the last state is always received and stored
 */

/**
 * Base class which can be extended to use various realtime communication services.
 * Methods to broadcast and subscribe to events.
 *
 * Stores the last message received/broadcasted to resend when required(when board is ready)
 */
class PusherCommunicationProvider {
  private initialized: boolean;
  private lastMessage: Record<string, any>;
  private pusher: Pusher | null;
  private channel: Channel | null;

  constructor() {
    this.initialized = false;
    this.lastMessage = {};
    this.pusher = null;
    this.channel = null;
  }

  public init = (roomId = ""): void => {
    if (this.initialized) {
      return;
    }

    this.pusher = new Pusher("5fc1fe39f533123857b5", {
      cluster: "us3",
      authEndpoint: process.env.REACT_APP_PUSHER_AUTHENDPOINT,
    });

    this.channel = this.pusher.subscribe(`private-${roomId}`);

    this.channel.bind("pusher:subscription_succeeded", this.resendLastEvents);

    console.log("Whiteboard initialized communication through Pusher");
    this.initialized = true;
  };

  public storeEvent = (eventName: string, message: any): void => {
    this.lastMessage[eventName] = { eventName, ...message };
  };

  public getStoredEvent = (eventName: string): any => {
    return this.lastMessage[eventName];
  };

  public broadcastEvent = (eventName: string, arg: any = {}): void => {
    this.storeEvent(eventName, arg);

    this.channel?.trigger(
      `client-${eventName}`,
      stringifyWithNull({ eventName, ...arg })
    );
  };

  public subscribe = (
    eventName: string,
    cb: (message: any) => void
  ): (() => void) => {
    this.channel?.bind(`client-${eventName}`, (message: any) =>
      this.storeEvent(eventName, message)
    );
    this.channel?.bind(`client-${eventName}`, cb);
    return () => {
      this.channel?.unbind(`client-${eventName}`, cb);
    };
  };

  private resendLastEvents = (): void => {
    for (const eventName in this.lastMessage) {
      if (this.lastMessage[eventName]) {
        this.channel?.trigger(
          `client-${eventName}`,
          this.lastMessage[eventName]
        );
      }
    }
  };
}

export const provider = new PusherCommunicationProvider();
