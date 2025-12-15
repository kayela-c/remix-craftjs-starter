import React, { useEffect, useState } from 'react';
import * as t from '@rekajs/types';
import { useReka } from '@rekajs/react';

import { useBuilder } from './builder-provider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

export const ControlPanel = () => {
  const { selectedTemplateId, deleteSelected } = useBuilder();
  const { reka } = useReka();
  const [classNameValue, setClassNameValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [mode, setMode] = useState<'text' | 'element' | null>(null);

  useEffect(() => {
    if (!selectedTemplateId) {
      setClassNameValue('');
      setTextValue('');
      setMode(null);
      return;
    }

    const template = reka.getNodeFromId(selectedTemplateId, t.Template);
    if (template instanceof t.TagTemplate && template.tag === 'text') {
      const literal =
        template.props.value instanceof t.Literal
          ? template.props.value.value
          : '';
      setTextValue(String(literal ?? ''));
      setClassNameValue('');
      setMode('text');
      return;
    }

    if (template instanceof t.TagTemplate) {
      const classLiteral =
        template.props.className instanceof t.Literal
          ? template.props.className.value
          : '';
      setClassNameValue(String(classLiteral ?? ''));
      setTextValue('');
      setMode('element');
      return;
    }

    setMode(null);
  }, [reka, selectedTemplateId]);

  const updateText = () => {
    if (!selectedTemplateId || mode !== 'text') {
      return;
    }
    reka.change(() => {
      const template = reka.getNodeFromId(selectedTemplateId, t.TagTemplate);
      template.props.value = t.literal({ value: textValue });
    });
  };

  const updateClassName = () => {
    if (!selectedTemplateId || mode !== 'element') {
      return;
    }
    reka.change(() => {
      const template = reka.getNodeFromId(selectedTemplateId, t.TagTemplate);
      template.props.className = t.literal({ value: classNameValue });
    });
  };

  return (
    <div className="h-auto w-80 border-l">
      <h3 className="border-b px-4 py-2 text-left text-md font-semibold">
        Control Panel
      </h3>
      {!selectedTemplateId ? (
        <p className="p-4 text-sm text-muted-foreground">
          Select an element in the preview to edit its content or classes.
        </p>
      ) : (
        <div className="space-y-4 p-4">
          {mode === 'text' ? (
            <div className="space-y-2">
              <Label htmlFor="textValue">Text value</Label>
              <Input
                id="textValue"
                value={textValue}
                onChange={(event) => setTextValue(event.target.value)}
              />
              <Button size="sm" onClick={updateText}>
                Update text
              </Button>
            </div>
          ) : null}

          {mode === 'element' ? (
            <div className="space-y-2">
              <Label htmlFor="className">CSS classes</Label>
              <Input
                id="className"
                value={classNameValue}
                onChange={(event) => setClassNameValue(event.target.value)}
              />
              <Button size="sm" onClick={updateClassName}>
                Update classes
              </Button>
            </div>
          ) : null}

          <Button variant="secondary" size="sm" onClick={deleteSelected}>
            Remove element
          </Button>
        </div>
      )}
    </div>
  );
};
