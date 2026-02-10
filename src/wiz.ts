import dgram from "dgram";
import { getPreferenceValues } from "@raycast/api";

const WIZ_PORT = 38899;

type Preferences = {
  broadcastAddress: string;
  discoveryTimeout: string;
};

export type WizLight = {
  ip: string;
  mac: string;
  state: boolean;
  dimming: number;
  moduleName?: string;
};

type WizResponse = {
  method: string;
  result?: {
    mac?: string;
    state?: boolean;
    dimming?: number;
    moduleName?: string;
  };
};

function getPrefs(): Preferences {
  const prefs = getPreferenceValues<Preferences>();
  if (!prefs.broadcastAddress) {
    throw new Error("Broadcast address is not configured in preferences");
  }
  if (!prefs.discoveryTimeout) {
    throw new Error("Discovery timeout is not configured in preferences");
  }
  return prefs;
}

export async function discoverLights(): Promise<WizLight[]> {
  const prefs = getPrefs();
  const timeout = parseInt(prefs.discoveryTimeout, 10);

  return new Promise((resolve) => {
    const lights: WizLight[] = [];
    const seenMacs = new Set<string>();
    const socket = dgram.createSocket("udp4");

    socket.on("error", () => {
      socket.close();
      resolve(lights);
    });

    socket.on("message", (msg, rinfo) => {
      try {
        const response: WizResponse = JSON.parse(msg.toString());
        if (response.method === "getPilot" && response.result?.mac) {
          const mac = response.result.mac;
          if (!seenMacs.has(mac)) {
            seenMacs.add(mac);
            lights.push({
              ip: rinfo.address,
              mac,
              state: response.result.state ?? false,
              dimming: response.result.dimming ?? 100,
              moduleName: response.result.moduleName,
            });
          }
        }
      } catch {
        // Ignore parse errors
      }
    });

    socket.bind(() => {
      socket.setBroadcast(true);
      const message = Buffer.from(JSON.stringify({ method: "getPilot" }));
      socket.send(message, WIZ_PORT, prefs.broadcastAddress);
    });

    setTimeout(() => {
      socket.close();
      resolve(lights);
    }, timeout);
  });
}

export async function setLightState(ip: string, state: boolean): Promise<void> {
  return sendCommand(ip, { method: "setPilot", params: { state } });
}

export async function setLightBrightness(ip: string, dimming: number): Promise<void> {
  return sendCommand(ip, { method: "setPilot", params: { state: true, dimming } });
}

export async function setAllLightsState(state: boolean): Promise<number> {
  const lights = await discoverLights();
  await Promise.all(lights.map((light) => setLightState(light.ip, state)));
  return lights.length;
}

async function sendCommand(ip: string, command: object): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");
    const message = Buffer.from(JSON.stringify(command));

    socket.on("error", (err) => {
      socket.close();
      reject(err);
    });

    socket.send(message, WIZ_PORT, ip, (err) => {
      socket.close();
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
