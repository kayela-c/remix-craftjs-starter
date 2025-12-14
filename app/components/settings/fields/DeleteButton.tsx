import { useEditor, useNode } from "@craftjs/core";
import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";

export const DeleteButton = () => {
  const { query, actions } = useEditor();
  const { id, deletable } = useNode((node) => ({
    deletable: query.node(node.id).isDeletable(),
  }));

  if (!deletable) {
    return null;
  }

  return (
    <Button
      variant={"destructive"}
      className="cursor-pointer mb-4 w-full"
      onClick={(event) => {
        event.stopPropagation();
        const parent = query.node(id).get().data.parent;
        if (parent) {
          actions.delete(id);
        }
      }}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </Button>
  );
};
