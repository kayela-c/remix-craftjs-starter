import * as t from '@rekajs/types';

type ImportMap = Map<string, Set<string>>;

const indent = (level: number) => ' '.repeat(level);

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return '""';
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return `{${value}}`;
  }
  if (Array.isArray(value)) {
    return `{${JSON.stringify(value)}}`;
  }
  if (typeof value === 'object') {
    return `{${JSON.stringify(value)}}`;
  }
  return '{/* expression */}';
};

const formatProps = (
  props: Record<string, any>,
  excludes: string[] = ['children', 'value']
) => {
  const entries = Object.entries(props || {}).filter(
    ([key]) => !excludes.includes(key)
  );
  if (!entries.length) {
    return '';
  }
  return (
    ' ' +
    entries
      .map(([key, value]) => `${key}=${formatValue(value)}`)
      .join(' ')
  );
};

const renderView = (
  view: t.View,
  level: number,
  imports: ImportMap
): string => {
  if (view instanceof t.TagView) {
    if (view.tag === 'text') {
      const value =
        typeof view.props.value === 'string'
          ? view.props.value
          : JSON.stringify(view.props.value ?? '');
      return `${indent(level)}${value}`;
    }
    const children = view.children
      .map((child) => renderView(child, level + 2, imports))
      .join('\n');
    const propString = formatProps(view.props);
    if (!children) {
      return `${indent(level)}<${view.tag}${propString} />`;
    }
    return `${indent(level)}<${view.tag}${propString}>\n${children}\n${indent(
      level
    )}</${view.tag}>`;
  }

  if (view instanceof t.RekaComponentView) {
    const children = view.render
      .map((child) => renderView(child, level + 2, imports))
      .join('\n');
    const componentName = view.component.name;
    if (!children) {
      return `${indent(level)}<${componentName} />`;
    }
    return `${indent(level)}<${componentName}>\n${children}\n${indent(
      level
    )}</${componentName}>`;
  }

  if (view instanceof t.ExternalComponentView) {
    const componentName = view.component.name;
    const importPath = view.component.meta?.importPath;
    if (componentName && importPath) {
      if (!imports.has(importPath)) {
        imports.set(importPath, new Set());
      }
      imports.get(importPath)?.add(componentName);
    }
    const propString = formatProps(view.props);
    return `${indent(level)}<${componentName}${propString} />`;
  }

  if (
    view instanceof t.FragmentView ||
    view instanceof t.FrameView ||
    view instanceof t.SlotView ||
    view instanceof t.EachSystemView
  ) {
    return view.children
      .map((child) => renderView(child, level, imports))
      .join('\n');
  }

  if (view instanceof t.ErrorSystemView) {
    return `${indent(level)}{/* Error: ${view.error} */}`;
  }

  return '';
};

export const getOutputCode = (view?: t.FrameView | null) => {
  if (!view) {
    return {
      importString: '',
      output: '// No preview to export yet.',
    };
  }

  const imports: ImportMap = new Map();
  const markup = view.children
    .map((child) => renderView(child, 4, imports))
    .join('\n');

  const importString = Array.from(imports.entries())
    .map(
      ([path, names]) => `import { ${Array.from(names).join(', ')} } from '${path}';`
    )
    .join('\n');

  const output = `
export function Component() {
  return (
${markup || indent(6) + '<div />'}
  );
}
`.trim();

  return {
    importString,
    output,
  };
};
