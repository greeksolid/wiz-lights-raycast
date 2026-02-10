import { showHUD } from "@raycast/api";
import { setAllLightsState } from "./wiz";

export default async function Command() {
  try {
    const count = await setAllLightsState(true);
    if (count === 0) {
      await showHUD("⚠️ No WiZ lights found");
    } else {
      await showHUD(`💡 Turned on ${count} light${count === 1 ? "" : "s"}`);
    }
  } catch (error) {
    await showHUD(`❌ Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
