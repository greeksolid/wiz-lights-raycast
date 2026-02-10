import { Action, ActionPanel, Clipboard, Icon, List, showToast, Toast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { discoverLights, setLightState, setLightBrightness, WizLight } from "./wiz";

export default function Command() {
  const { data: lights, isLoading, revalidate } = usePromise(discoverLights);

  return (
    <List isLoading={isLoading}>
      {lights?.length === 0 && (
        <List.EmptyView
          title="No WiZ lights found"
          description="Make sure your lights are on the same network. Check Broadcast Address in preferences."
        />
      )}
      {lights?.map((light) => (
        <LightItem key={light.mac} light={light} onUpdate={revalidate} />
      ))}
    </List>
  );
}

function LightItem({ light, onUpdate }: { light: WizLight; onUpdate: () => void }) {
  const subtitle = light.state ? `${light.dimming}%` : "Off";
  const icon = light.state ? Icon.LightBulb : Icon.LightBulbOff;

  async function toggle() {
    try {
      await setLightState(light.ip, !light.state);
      await showToast({ title: light.state ? "Turned off" : "Turned on" });
      onUpdate();
    } catch {
      await showToast({ style: Toast.Style.Failure, title: "Failed to toggle light" });
    }
  }

  async function setBrightness(dimming: number) {
    try {
      await setLightBrightness(light.ip, dimming);
      await showToast({ title: `Brightness set to ${dimming}%` });
      onUpdate();
    } catch {
      await showToast({ style: Toast.Style.Failure, title: "Failed to set brightness" });
    }
  }

  return (
    <List.Item
      title={light.moduleName ?? light.mac}
      subtitle={subtitle}
      icon={icon}
      accessories={[{ text: light.ip }]}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action title={light.state ? "Turn Off" : "Turn On"} icon={Icon.Power} onAction={toggle} />
          </ActionPanel.Section>
          <ActionPanel.Section title="Brightness">
            <Action title="10%" icon={Icon.CircleProgress25} onAction={() => setBrightness(10)} />
            <Action title="25%" icon={Icon.CircleProgress25} onAction={() => setBrightness(25)} />
            <Action title="50%" icon={Icon.CircleProgress50} onAction={() => setBrightness(50)} />
            <Action title="75%" icon={Icon.CircleProgress75} onAction={() => setBrightness(75)} />
            <Action title="100%" icon={Icon.CircleProgress100} onAction={() => setBrightness(100)} />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action
              title="Copy IP Address"
              icon={Icon.Clipboard}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
              onAction={() => Clipboard.copy(light.ip)}
            />
            <Action
              title="Copy MAC Address"
              icon={Icon.Clipboard}
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
              onAction={() => Clipboard.copy(light.mac)}
            />
            <Action title="Refresh" icon={Icon.ArrowClockwise} shortcut={{ modifiers: ["cmd"], key: "r" }} onAction={onUpdate} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
