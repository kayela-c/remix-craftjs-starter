import { DeleteButton } from "./settings/fields/DeleteButton";
import { TextInput } from "./settings/fields/TextInput";
import { ClassNameSelector } from "./settings/fields/ClassNameSelector";
import { HrefInput } from "./settings/fields/HrefInput";
import { TargetSelector } from "./settings/fields/TargetSelector";

export const LinkSettingsControl = () => {
  return (
    <div className="p-4">
      <DeleteButton />
      <TextInput />
      <HrefInput />
      <TargetSelector />
      <ClassNameSelector />
    </div>
  );
};
