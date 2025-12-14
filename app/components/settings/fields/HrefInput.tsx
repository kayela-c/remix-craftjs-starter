import { useNode } from "@craftjs/core";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export const HrefInput = () => {
  const {
    href,
    actions: { setProp },
  } = useNode((node) => ({
    href: node.data.props["href"] as string,
  }));

  return (
    <div className="px-4 pb-4">
      <Label htmlFor="href">URL</Label>
      <Input
        id="href"
        type="text"
        value={href || "#"}
        placeholder="Enter URL (e.g., /about)"
        className="mt-2"
        onChange={(e) =>
          setProp((props: any) => (props.href = e.target.value))
        }
      />
    </div>
  );
};
