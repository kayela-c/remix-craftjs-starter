import React from 'react';
import clsx from 'clsx';
import * as t from '@rekajs/types';

import { useBuilder } from './builder-provider';

type RendererNodeProps = {
  view: t.View;
};

const isTagView = (view: t.View): view is t.TagView =>
  view instanceof t.TagView;

const isRekaComponentView = (
  view: t.View
): view is t.RekaComponentView => view instanceof t.RekaComponentView;

const isExternalComponentView = (
  view: t.View
): view is t.ExternalComponentView => view instanceof t.ExternalComponentView;

const RendererNode: React.FC<RendererNodeProps> = ({ view }) => {
  const { selectTemplate, selectedTemplateId } = useBuilder();

  if (isTagView(view)) {
    const templateId = view.template.id;
    const isSelected = selectedTemplateId === templateId;
    const props = { ...view.props };
    const className = clsx(
      props.className,
      'cursor-pointer',
      isSelected && 'ring-2 ring-primary ring-offset-2'
    );
    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      selectTemplate(templateId);
      const userHandler = props.onClick as ((event: React.MouseEvent) => void) | undefined;
      if (userHandler) {
        userHandler(event);
      }
    };

    if (view.tag === 'text') {
      return (
        <span
          key={view.key}
          data-template-id={templateId}
          className={clsx(
            className,
            'inline-block min-w-[24px] rounded-sm px-1'
          )}
          onClick={handleClick}
        >
          {props.value ?? 'Text'}
        </span>
      );
    }

    return React.createElement(
      view.tag,
      {
        key: view.key,
        ...props,
        className,
        'data-template-id': templateId,
        onClick: handleClick,
      },
      view.children.map((child) => (
        <RendererNode key={child.key} view={child} />
      ))
    );
  }

  if (isRekaComponentView(view)) {
    return (
      <React.Fragment key={view.key}>
        {view.render.map((child) => (
          <RendererNode key={child.key} view={child} />
        ))}
      </React.Fragment>
    );
  }

  if (isExternalComponentView(view)) {
    const templateId = view.template.id;
    const isSelected = selectedTemplateId === templateId;
    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      selectTemplate(templateId);
    };
    const element = view.component.render(view.props);
    return (
      <div
        key={view.key}
        onClick={handleClick}
        className={clsx(
          'relative cursor-pointer rounded-md',
          isSelected && 'ring-2 ring-primary ring-offset-2'
        )}
        data-template-id={templateId}
      >
        {element}
      </div>
    );
  }

  if (view instanceof t.FragmentView || view instanceof t.FrameView) {
    return (
      <React.Fragment key={view.key}>
        {view.children.map((child) => (
          <RendererNode key={child.key} view={child} />
        ))}
      </React.Fragment>
    );
  }

  if (view instanceof t.SlotView || view instanceof t.EachSystemView) {
    return (
      <React.Fragment key={view.key}>
        {view.children.map((child) => (
          <RendererNode key={child.key} view={child} />
        ))}
      </React.Fragment>
    );
  }

  if (view instanceof t.ErrorSystemView) {
    return (
      <div
        key={view.key}
        className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800"
      >
        {view.error}
      </div>
    );
  }

  return null;
};

export const RekaRenderer = () => {
  const { view, clearSelection } = useBuilder();

  if (!view) {
    return (
      <div className="p-8 text-sm text-muted-foreground">
        Preparing preview…
      </div>
    );
  }

  return (
    <div className="min-h-full w-full" onClick={clearSelection}>
      {view.children.map((child) => (
        <RendererNode key={child.key} view={child} />
      ))}
    </div>
  );
};
