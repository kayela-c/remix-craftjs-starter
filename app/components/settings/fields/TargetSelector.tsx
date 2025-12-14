import { useNode } from "@craftjs/core";
import { Label } from "../../ui/label";

export const TargetSelector = () => {
  const {
    target,
    actions: { setProp },
  } = useNode((node) => ({
    target: node.data.props["target"] as string,
  }));

  return (
    <div className="px-4 pb-4">
      <Label htmlFor="target">Link Target</Label>
      <select
        id="target"
        value={target || "_self"}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mt-2"
        onChange={(e) =>
          setProp((props: any) => (props.target = e.target.value))
        }
      >
        <option value="_self">Same Window</option>
        <option value="_blank">New Window</option>
        <option value="_parent">Parent Frame</option>
        <option value="_top">Top Frame</option>
      </select>
    </div>
  );
};
