// Copyright (C) LoginID

/* istanbul ignore file */
/* tslint:disable */

/**
 * Information about the device. All of these attributes are optional and should
 * be provided on best effort basis. If provide, they will be taken into
 * consideration in order to improve user experience.
 */
export type DeviceInfo = {
    /**
     * Client name
     */
    clientName?: string;
    /**
     * Client type.
     */
    clientType?: "browser" | "other";
    /**
     * Client version
     */
    clientVersion?: string;
    /**
     * An unique device identifier
     */
    deviceId?: string;
    /**
     * Whether the client browser has access to bluetooth.
     */
    hasBluetooth?: boolean;
    /**
     * Last use timestamp in rfc3339 format
     */
    lastUsedAt?: string;
    /**
     * OS architecture
     */
    osArch?: string;
    /**
     * OS name
     */
    osName?: string;
    /**
     * OS version
     */
    osVersion?: string;
    /**
     * Screen height in pixels
     */
    screenHeight?: number;
    /**
     * Screen width in pixels
     */
    screenWidth?: number;
    /**
     * JSON string containing client webauthn capabilities.
     */
    webauthnCapabilities?: string;
  };
  