# WiZ Lights for Raycast

Control your WiZ smart lights directly from Raycast using the local UDP protocol — no cloud, no middleware, no latency.

## Commands

| Command | Description |
|---------|-------------|
| **Toggle Lights** | If any light is on, turns all off. Otherwise turns all on. |
| **Turn Off Lights** | Turn off all lights |
| **Turn On Lights** | Turn on all lights |
| **Manage Lights** | List view with individual control, brightness presets, IP/MAC info |

## Installation

```bash
cd wiz-lights
npm install
npm run dev
```

This registers the extension with Raycast. The commands will be available immediately.

To make it permanent, go to Raycast → Extensions → `+` → "Import Extension" → select the `wiz-lights` folder.

## Configuration

Open Raycast → Extensions → WiZ Lights → Preferences:

| Setting | Default | Description |
|---------|---------|-------------|
| **Broadcast Address** | `192.168.1.255` | Your network's broadcast address. Find yours with `ifconfig \| grep broadcast` |
| **Discovery Timeout** | `1500` | How long to wait for lights to respond (ms) |

## Troubleshooting

### No lights found

1. Make sure your WiZ lights are connected to WiFi (check the WiZ app)
2. Ensure your Mac is on the same network as the lights
3. Try setting the correct broadcast address in preferences (e.g., `192.168.1.255` for a `192.168.1.x` network)
4. Increase the discovery timeout if lights respond slowly

### Finding your broadcast address

```bash
ifconfig | grep broadcast
```

Look for the `broadcast` value (e.g., `192.168.1.255`).

## How it works

WiZ bulbs listen on UDP port 38899 and respond to JSON commands:

- `{"method": "getPilot"}` — get current state
- `{"method": "setPilot", "params": {"state": true}}` — turn on
- `{"method": "setPilot", "params": {"state": false}}` — turn off
- `{"method": "setPilot", "params": {"dimming": 50}}` — set brightness (10-100)

The extension broadcasts a discovery message and collects responses to find all lights on the network.
