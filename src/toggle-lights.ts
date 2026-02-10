import { showHUD } from "@raycast/api";
import { discoverLights, setLightState } from "./wiz";

export default async function Command() {
  try {
    const lights = await discoverLights();

    if (lights.length === 0) {
      await showHUD("⚠️ No WiZ lights found");
      return;
    }

    // If any light is on, turn all off. Otherwise turn all on.
    const anyOn = lights.some((light) => light.state);
    const newState = !anyOn;

    await Promise.all(lights.map((light) => setLightState(light.ip, newState)));

    const action = newState ? "on" : "off";
    await showHUD(`💡 Toggled ${lights.length} light${lights.length === 1 ? "" : "s"} ${action}`);
  } catch (error) {
    await showHUD(`❌ Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
