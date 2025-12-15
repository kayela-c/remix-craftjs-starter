import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Frame } from '@rekajs/core';
import { useReka } from '@rekajs/react';
import * as t from '@rekajs/types';

import { ROOT_COMPONENT_NAME, getComponentByName } from '~/lib/reka';

type BuilderContextValue = {
  frame: Frame | null;
  view: t.FrameView | null;
  selectedTemplateId?: string;
  selectTemplate: (id?: string) => void;
  addTemplate: (factory: () => t.Template) => void;
  deleteSelected: () => void;
  clearSelection: () => void;
};

const BuilderContext = createContext<BuilderContextValue | undefined>(
  undefined
);

export const BuilderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { reka } = useReka();
  const [frame] = useState(() => {
    const existingFrame = reka.getFrame('builder-frame');
    if (existingFrame) {
      return existingFrame;
    }
    // React StrictMode double renders during development, so guard against
    // creating the same frame twice by reusing any existing instance.
    return reka.createFrame({
      id: 'builder-frame',
      component: { name: ROOT_COMPONENT_NAME, props: {} },
      evaluateImmediately: true,
    });
  });
  const [viewVersion, setViewVersion] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();

  useEffect(() => {
    frame.compute(true);
    setViewVersion((value) => value + 1);
    const dispose = reka.watch(() => {
      frame.compute();
      setViewVersion((value) => value + 1);
    });
    return () => {
      dispose();
      reka.removeFrame(frame);
    };
  }, [frame, reka]);

  const selectTemplate = useCallback((id?: string) => {
    setSelectedTemplateId(id);
  }, []);

  const addTemplate = useCallback(
    (factory: () => t.Template) => {
      reka.change(() => {
        const component = getComponentByName(ROOT_COMPONENT_NAME);
        const root = t.assert(component.template, t.TagTemplate);
        root.children.push(factory());
      });
    },
    [reka]
  );

  const deleteSelected = useCallback(() => {
    if (!selectedTemplateId) {
      return;
    }
    reka.change(() => {
      const template = reka.getNodeFromId(selectedTemplateId, t.Template);
      const parent = reka.getParentNode(template, t.SlottableTemplate);
      if (parent && Array.isArray(parent.children)) {
        parent.children = parent.children.filter((child) => child !== template);
      }
    });
    setSelectedTemplateId(undefined);
  }, [reka, selectedTemplateId]);

  const clearSelection = useCallback(() => {
    setSelectedTemplateId(undefined);
  }, []);

  const view = useMemo(() => frame.view ?? null, [frame, viewVersion]);

  const value = useMemo<BuilderContextValue>(
    () => ({
      frame,
      view,
      selectedTemplateId,
      selectTemplate,
      addTemplate,
      deleteSelected,
      clearSelection,
    }),
    [
      frame,
      view,
      selectedTemplateId,
      selectTemplate,
      addTemplate,
      deleteSelected,
      clearSelection,
    ]
  );

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used inside BuilderProvider');
  }
  return context;
};
