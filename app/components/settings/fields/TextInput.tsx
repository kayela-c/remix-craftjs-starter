import { useNode } from "@craftjs/core";
import { ReactNode } from "react";
import { Input } from "../../ui/input";

export const TextInput = () => {
  const {
    text,
    actions: { setProp },
  } = useNode((node) => ({
    text: node.data.props["children"] as string,
  }));

  if (typeof text !== "string") {
    return null;
  }

  return (
    <Input
      type="text"
      value={text}
      className="mb-4"
      onChange={(e) =>
        setProp(
          (props: { children: ReactNode }) =>
            (props.children = e.target.value.replace(/<\/?[^>]+(>|$)/g, ""))
        )
      }
    />
  );
};
