/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Broadcast Address - Your network broadcast address (e.g. 192.168.1.255) */
  "broadcastAddress": string,
  /** Discovery Timeout (ms) - How long to wait for lights to respond */
  "discoveryTimeout": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `turn-off-lights` command */
  export type TurnOffLights = ExtensionPreferences & {}
  /** Preferences accessible in the `turn-on-lights` command */
  export type TurnOnLights = ExtensionPreferences & {}
  /** Preferences accessible in the `toggle-lights` command */
  export type ToggleLights = ExtensionPreferences & {}
  /** Preferences accessible in the `manage-lights` command */
  export type ManageLights = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `turn-off-lights` command */
  export type TurnOffLights = {}
  /** Arguments passed to the `turn-on-lights` command */
  export type TurnOnLights = {}
  /** Arguments passed to the `toggle-lights` command */
  export type ToggleLights = {}
  /** Arguments passed to the `manage-lights` command */
  export type ManageLights = {}
}

