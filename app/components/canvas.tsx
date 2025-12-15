import { Code, Redo, Undo } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useReka } from '@rekajs/react';

import { useBuilder } from './builder-provider';
import { getOutputCode } from '~/lib/code-gen';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { CodeView } from './code-view';

type CanvasProps = {
  children: React.ReactNode;
};

export const Canvas = ({ children }: CanvasProps) => {
  const [open, setOpen] = useState(false);
  const [output, setOutput] = useState('');
  const { view } = useBuilder();
  const { reka } = useReka();
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  useEffect(() => {
    setHistoryState({
      canUndo: reka.canUndo(),
      canRedo: reka.canRedo(),
    });
    const dispose = reka.watch(() => {
      setHistoryState({
        canUndo: reka.canUndo(),
        canRedo: reka.canRedo(),
      });
    });
    return () => {
      dispose();
    };
  }, [reka]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const { importString, output } = getOutputCode(view);
    const codeString = [importString, output].filter(Boolean).join('\n\n');
    setOutput(codeString);
  }, [open, view]);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex h-full w-full flex-col rounded-sm border">
        <div className="flex w-full items-center justify-between bg-gray-200 p-4">
          <div className="flex gap-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex gap-2">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger>
                <Code
                  size={24}
                  strokeWidth={1.75}
                  className="text-gray-500 transition duration-300 hover:text-primary"
                />
              </DrawerTrigger>
              <DrawerContent className="h-[75vh]">
                <CodeView codeString={output || '// No output yet'} />
              </DrawerContent>
            </Drawer>
          </div>

          <div className="flex items-center gap-2 opacity-80">
            <button
              className="w-8 text-gray-500 transition duration-300 hover:text-primary disabled:opacity-40"
              onClick={() => reka.undo()}
              disabled={!historyState.canUndo}
            >
              <Undo size={24} strokeWidth={1.75} />
            </button>
            <button
              className="w-8 text-gray-500 transition duration-300 hover:text-primary disabled:opacity-40"
              onClick={() => reka.redo()}
              disabled={!historyState.canRedo}
            >
              <Redo size={24} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex-1 rounded-b-lg bg-white">{children}</div>
      </div>
    </div>
  );
};
